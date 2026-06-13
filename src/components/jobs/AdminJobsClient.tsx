"use client";

import { useState } from "react";
import type { JobSummary } from "@/lib/jobs/jobRepository";
import InsertJobUrlForm from "./InsertJobUrlForm";
import ExpandableJobTable from "./ExpandableJobTable";
import { useRouter } from "next/navigation";

type Props = {
  jobs: JobSummary[];
  positionsCount: number;
  readOnly?: boolean;
};

export default function AdminJobsClient({
    jobs,
    positionsCount,
    readOnly = false,
  }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [toolbarMessage, setToolbarMessage] = useState("");
  const router = useRouter();

  async function handleToolbarStatusChange(status: string) {
    if (selectedIds.size === 0) {
      return;
    }
    setToolbarMessage("");
    const response = await fetch("/api/job-agent/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: Array.from(selectedIds),
        status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const ids = Array.from(selectedIds).reverse();

    sessionStorage.setItem(
      "job-agent-highlight-ids",
      JSON.stringify(ids)
    );

    setSelectedIds(new Set());

    router.refresh();
  }
  return (
    <>
      <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
        <span>{jobs.length} positions loaded</span>
        <span>{toolbarMessage}</span>
      </div>
      <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
      {["Delete", "New", "Seen", "Applied", "Rejected", "Skipped"].map(
        (label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleToolbarStatusChange(label.toLowerCase())}
            disabled={readOnly || selectedIds.size === 0}
className={`w-[92px] shrink-0 rounded px-3 py-2 text-center text-sm font-semibold text-black transition-colors ${              
          !readOnly && selectedIds.size > 0
          ? "bg-blue-100 hover:bg-blue-200"
          : "bg-gray-50 opacity-50 hover:bg-gray-100"    
          }`}
          >
            {label}
          </button>
        )
      )}

  <div className="ml-auto min-w-0 flex-1">
    <InsertJobUrlForm
      hasSelection={selectedIds.size > 0}
      selectedIds={Array.from(selectedIds)}
      clearSelection={() => setSelectedIds(new Set())}
      setToolbarMessage={setToolbarMessage}
      readOnly={readOnly}
    />
  </div>
</div>
      <div className="min-h-0 flex-1">
        <ExpandableJobTable
  jobs={jobs}
  selectedIds={selectedIds}
  setSelectedIds={setSelectedIds}
  readOnly={readOnly}
/>
      </div>
    </>
  );
}