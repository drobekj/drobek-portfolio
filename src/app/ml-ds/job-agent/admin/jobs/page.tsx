import ExpandableJobTable from "@/components/jobs/ExpandableJobTable";
import { getJobSummaries } from "@/lib/jobs/jobRepository";

export default function AdminJobsPage() {
  const jobs = getJobSummaries();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">AI Job Agent</h1>

      <p className="mt-2 text-sm text-gray-500">
        Internal dashboard for evaluated job opportunities.
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {jobs.length} positions loaded
      </p>

      <ExpandableJobTable jobs={jobs} />
    </div>
  );
}