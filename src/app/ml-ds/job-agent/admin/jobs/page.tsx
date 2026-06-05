import AdminJobsClient from "@/components/jobs/AdminJobsClient";
import { getJobSummaries } from "@/lib/jobs/jobRepository";

export default function AdminJobsPage() {
  const jobs = getJobSummaries();

  return (
    <div className="flex h-[calc(120vh-280px)] flex-col">
      <div className="shrink-0 bg-white pb-1">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              AI Job Agent
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Internal dashboard for evaluated job opportunities.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {jobs.length} positions loaded
            </p>
          </div>
        </div>
      </div>

      <AdminJobsClient jobs={jobs} />
    </div>
  );
}