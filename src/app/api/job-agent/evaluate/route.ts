import { NextResponse } from "next/server";
import { execFile } from "child_process";

const JOB_AGENT_DIR = "C:\\Users\\drobe\\job_agent";

function runPythonEvaluate(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      "python",
      ["add_web_job.py", "evaluate", url],
      {
        cwd: JOB_AGENT_DIR,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || stdout || error.message));
          return;
        }

        resolve(stdout);
      }
    );
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing URL" },
        { status: 400 }
      );
    }

    const output = await runPythonEvaluate(url);

    return NextResponse.json({
      ok: true,
      output,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}