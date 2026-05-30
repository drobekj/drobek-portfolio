import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobDetail } from "@/lib/jobs/jobRepository";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminJobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJobDetail(Number(id));

  if (!job) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/ml-ds/job-agent/admin/jobs"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to jobs
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {job.title ?? "(no title)"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {job.company ?? "Unknown company"} · {job.location ?? "Unknown location"}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase text-gray-500">Score</div>
          <div className="mt-1 text-2xl font-semibold">{job.finalScore}</div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase text-gray-500">Verdict</div>
          <div className="mt-1 text-2xl font-semibold">
            {job.verdict ?? "—"}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase text-gray-500">Salary</div>
          <div className="mt-1 text-2xl font-semibold">
            {job.salaryEstimateCzk
              ? `${job.salaryEstimateCzk.toLocaleString("cs-CZ")} CZK`
              : "—"}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold">Metadata</h2>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <span className="text-gray-500">ID:</span> {job.id}
          </div>

          <div>
            <span className="text-gray-500">Processed:</span>{" "}
            {job.processedAt}
          </div>

          <div>
            <span className="text-gray-500">Status:</span>{" "}
            {job.status ?? "—"}
          </div>

          <div>
            <span className="text-gray-500">Source:</span>{" "}
            {job.sourceFile ?? "—"}
          </div>

          <div>
            <span className="text-gray-500">Shortlisted:</span>{" "}
            {job.isShortlisted ? "yes" : "no"}
          </div>

          <div>
            <span className="text-gray-500">Original URL:</span>{" "}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              open
            </a>
          </div>

          <div className="md:col-span-2">
            <span className="text-gray-500">Private note:</span>{" "}
            {job.privateNote ?? ""}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold">Evaluation report</h2>

        <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
          {job.markdownReport ?? ""}
        </pre>
      </div>
    </div>
  );
}