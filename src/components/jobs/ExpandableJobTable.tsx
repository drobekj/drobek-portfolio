"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import type { JobSummary } from "@/lib/jobs/jobRepository";

type Props = {
  jobs: JobSummary[];
};

function jobRowId(url: string) {
  return `job-${encodeURIComponent(url)}`;
}

export default function ExpandableJobTable({ jobs }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const targetUrl = sessionStorage.getItem("job-agent-scroll-url");

    if (!targetUrl) {
      return;
    }

    const element = document.getElementById(jobRowId(targetUrl));

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      document
        .querySelectorAll(".job-agent-highlight")
        .forEach((el) =>
          el.classList.remove("job-agent-highlight", "bg-yellow-50")
        );

      element.classList.add("job-agent-highlight", "bg-yellow-50");

      sessionStorage.removeItem("job-agent-scroll-url");
    }
  }, [jobs]);
  return (
    <div className="mt-4 h-full overflow-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-20 bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Verdict</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">URL</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job, index) => {
            const isOpen = openId === job.id;

            return (
              <Fragment key={job.id}>
                <tr
                  id={jobRowId(job.url)}
                  onClick={() => setOpenId(isOpen ? null : job.id)}
                  className="scroll-mt-12 cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                  <td className="px-4 py-3 font-medium">
                    {job.title ?? "(no title)"}
                  </td>

                  <td className="px-4 py-3">{job.company ?? ""}</td>
                  <td className="px-4 py-3">{job.location ?? ""}</td>

                  <td className="px-4 py-3 font-semibold">
                    {job.status === "prepared" ? "—" : job.finalScore}
                  </td>

                  <td className="px-4 py-3">
                    {job.status === "prepared" ? "—" : job.verdict ?? ""}
                  </td>

                  <td className="px-4 py-3">
                    {job.status === "prepared"
                      ? "—"
                      : job.salaryEstimateCzk
                        ? `${job.salaryEstimateCzk.toLocaleString("cs-CZ")} CZK`
                        : ""}
                  </td>

                  <td className="px-4 py-3">{job.status ?? ""}</td>

                  <td className="px-4 py-3">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      open
                    </a>
                  </td>
                </tr>

                {isOpen ? (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid gap-3 text-sm md:grid-cols-2">
                        <div>
                          <span className="text-gray-500">ID:</span> {job.id}
                        </div>

                        <div>
                          <span className="text-gray-500">Processed:</span>{" "}
                          {job.processedAt}
                        </div>

                        <div>
                          <span className="text-gray-500">Source:</span>{" "}
                          {job.sourceFile ?? ""}
                        </div>

                        <div>
                          <span className="text-gray-500">Shortlisted:</span>{" "}
                          {job.isShortlisted ? "yes" : "no"}
                        </div>

                        <div className="md:col-span-2">
                          <span className="text-gray-500">Private note:</span>{" "}
                          {job.privateNote ?? ""}
                        </div>

                        <div className="md:col-span-2">
                          <Link
                            href={`/ml-ds/job-agent/admin/jobs/${job.id}`}
                            className="font-medium underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            Open full detail
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}