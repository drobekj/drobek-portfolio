import ExpandableJobTable from "@/components/jobs/ExpandableJobTable";
import InsertJobUrlForm from "@/components/jobs/InsertJobUrlForm";
import { getJobSummaries } from "@/lib/jobs/jobRepository";

export default function AdminJobsPage() {
  const jobs = getJobSummaries();

  return (
    <div className="flex h-[calc(120vh-280px)] flex-col">
      <div className="shrink-0 border-b border-gray-200 bg-white pb-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              AI Job Agent
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Internal dashboard for evaluated job opportunities.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {jobs.length} positions loaded
            </p>
          </div>

          <InsertJobUrlForm />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ExpandableJobTable jobs={jobs} />
      </div>
    </div>
  );
}