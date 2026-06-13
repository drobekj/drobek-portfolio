import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getJobUrlsByIds } from "@/lib/jobs/jobRepository";
const JOB_AGENT_DIR = "C:\\Users\\drobe\\job_agent";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ids = body.ids;

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { ok: false, error: "Invalid ids" },
        { status: 400 }
      );
    }

    const jobs = getJobUrlsByIds(ids);

    for (const job of jobs) {
      await execFileAsync(
        "python",
        ["add_web_job.py", "evaluate", job.url, "--force"],
        {
          cwd: JOB_AGENT_DIR,
          windowsHide: true,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      output: `Evaluated ${jobs.length} job(s)`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Bulk evaluate failed",
      },
      { status: 500 }
    );
  }
}