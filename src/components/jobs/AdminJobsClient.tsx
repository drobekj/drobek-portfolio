"use client";

import { useState } from "react";
import type { JobSummary } from "@/lib/jobs/jobRepository";
import InsertJobUrlForm from "./InsertJobUrlForm";
import ExpandableJobTable from "./ExpandableJobTable";

type Props = {
  jobs: JobSummary[];
};

export default function AdminJobsClient({ jobs }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  return (
    <>
      <div className="flex items-center justify-end">
        <InsertJobUrlForm
        hasSelection={selectedIds.size > 0}
        selectedIds={Array.from(selectedIds)}
        clearSelection={() => setSelectedIds(new Set())}
        />        
      </div>

      <div className="min-h-0 flex-1">
        <ExpandableJobTable
          jobs={jobs}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>
    </>
  );
}