import AdminJobsClient from "@/components/jobs/AdminJobsClient";
import { getJobSummaries } from "@/lib/jobs/jobRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PublicJobsPage() {
  const jobs = getJobSummaries().map((job) => ({ ...job, privateNote: null }));

  return (
    <div className="flex h-[calc(120vh-280px)] flex-col">
      <Breadcrumbs
        items={[
          { href: "/applications", label: "Applications" },
          { href: "/applications/job_agent", label: "AI Job Agent" },
          { href: "/applications/job-agent/public/jobs", label: "Job Dashboard" },
        ]}
      />
      <div className="shrink-0 bg-white pb-1">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Job Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Read-only overview of evaluated job opportunities.
            </p>
          </div>
          <Link
            href="/applications/job-agent/admin/jobs"
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Admin
          </Link>          
        </div>
      </div>

      <AdminJobsClient
  jobs={jobs}
  positionsCount={jobs.length}
  readOnly
/>
    </div>
  );
}
