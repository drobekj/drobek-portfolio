import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function JobAgentPublicOverview() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { href: "/applications", label: "Applications" },
          { href: "/applications/job_agent", label: "AI Job Agent" },
          { href: "/applications/job-agent/overview", label: "Public Project Overview" },
        ]}
      />

      <h1 className="text-3xl font-semibold tracking-tight">AI Job Agent</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">
        A job-search intelligence workflow that turns job URLs into structured,
        scored evaluations and keeps the review process in a local SQLite-backed
        workspace.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Workflow</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
            <li>URL ingestion and normalization.</li>
            <li>Job-page fetching and metadata extraction.</li>
            <li>Prepare mode for metadata-only staging without an AI call.</li>
            <li>Evaluate mode with LLM-based structured assessment.</li>
            <li>SQLite persistence for review status and evaluation history.</li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Scoring</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The evaluation combines model-generated component assessments with
            deterministic scoring logic, including compensation realism, and
            produces a final score, verdict, salary estimate, and review report.
          </p>
        </section>
      </div>

      <div className="mt-4 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Public / private boundary</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The operational dashboard uses a local job database and private review
          notes, so it is intentionally not exposed as the public portfolio demo.
          The public portfolio shows this architecture overview and the source
          repository instead.
        </p>
      </div>

      <div className="mt-6">
        <a
          href="https://github.com/drobekj/job-agent"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Open GitHub Repository
        </a>
      </div>
    </div>
  );
}
