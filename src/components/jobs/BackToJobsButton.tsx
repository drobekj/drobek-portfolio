"use client";

import { useRouter } from "next/navigation";

type BackToJobsButtonProps = {
  id: number;
  status: string | null;
};

export function BackToJobsButton({ id, status }: BackToJobsButtonProps) {
  const router = useRouter();

  async function handleClick() {
    if (status === "new") {
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

    router.push("/ml-ds/job-agent/admin/jobs");
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