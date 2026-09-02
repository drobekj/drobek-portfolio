import AdminJobsClient from "@/components/jobs/AdminJobsClient";
import JobAgentPublicOverview from "@/components/jobs/JobAgentPublicOverview";
import { getJobSummaries } from "@/lib/jobs/jobRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export default function PublicJobsPage() {
  let jobs;

  try {
    jobs = getJobSummaries().map((job) => ({ ...job, privateNote: null }));
  } catch {
    return <JobAgentPublicOverview />;
  }

  return (
    <div className="flex h-[calc(120vh-280px)] flex-col">
      <Breadcrumbs
        items={[
          { href: "/applications", label: "Applications" },
          { href: "/applications/job_agent", label: "AI Job Agent" },
          { href: "/ml-ds/job-agent/public/jobs", label: "Job Dashboard" },
        ]}
      />

      <div className="shrink-0 bg-white pb-1">
        <h1 className="text-3xl font-semibold tracking-tight">Job Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Read-only overview of evaluated job opportunities.
        </p>
      </div>

      <AdminJobsClient jobs={jobs} positionsCount={jobs.length} readOnly />
    </div>
  );
}
