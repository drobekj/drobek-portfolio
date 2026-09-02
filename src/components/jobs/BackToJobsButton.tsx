"use client";

import { useRouter } from "next/navigation";

type BackToJobsButtonProps = {
  id: number;
  status: string | null;
  mode?: "admin" | "public";
};

export function BackToJobsButton({
  id,
  status,
  mode = "admin",
}: BackToJobsButtonProps) {
  const router = useRouter();

  async function handleClick() {
    if (mode === "admin" && status === "new") {
      await fetch("/api/job-agent/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [id],
          status: "seen",
        }),
      });
    }

    router.push(
      mode === "public"
          ? "/applications/job-agent/public/jobs"
          : "/applications/job-agent/admin/jobs"
      );
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm text-gray-500 hover:text-gray-900"
    >
      ← Back to jobs
    </button>
  );
}