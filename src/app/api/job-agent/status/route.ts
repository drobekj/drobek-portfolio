import { NextResponse } from "next/server";
import { updateJobStatuses } from "@/lib/jobs/jobRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ids = body.ids;
    const status = body.status;

    if (!Array.isArray(ids) || typeof status !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const updated = updateJobStatuses(ids, status);

    return NextResponse.json({
      updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}