import { NextRequest, NextResponse } from "next/server";
import { updateJobPrivateNote } from "@/lib/jobs/jobRepository";

export async function POST(request: NextRequest) {
  try {
    const { id, privateNote } = await request.json();

    if (typeof id !== "number") {
      return NextResponse.json(
        { ok: false, error: "Invalid id" },
        { status: 400 }
      );
    }

    updateJobPrivateNote(id, privateNote ?? "");

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update private note",
      },
      { status: 500 }
    );
  }
}