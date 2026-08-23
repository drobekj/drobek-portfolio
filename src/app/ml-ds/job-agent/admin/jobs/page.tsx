import AdminJobsClient from "@/components/jobs/AdminJobsClient";
import { getJobSummaries } from "@/lib/jobs/jobRepository";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminJobsPage() {
  const jobs = getJobSummaries();

  return (
    <div className="flex h-[calc(120vh-280px)] flex-col">
      <Breadcrumbs
        items={[
          { href: "/ml-ds", label: "ML/DS" },
          { href: "/ml-ds/job_agent", label: "AI Job Agent" },
          { href: "/ml-ds/job-agent/admin/jobs", label: "Job Dashboard" }
        ]}
      />
      <div className="shrink-0 bg-white pb-1">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Job Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Admin access to evaluated job opportunities.
            </p>

          </div>
          <Link
            href="/ml-ds/job-agent/public/jobs"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Public
          </Link>
        </div>
      </div>

      <AdminJobsClient jobs={jobs} positionsCount={jobs.length} />
    </div>
  );
}
