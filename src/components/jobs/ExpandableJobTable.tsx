"use client";

import { useState } from "react";
import Link from "next/link";
import type { JobSummary } from "@/lib/jobs/jobRepository";

type Props = {
  jobs: JobSummary[];
};

export default function ExpandableJobTable({ jobs }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Verdict</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job, index) => {
            const isOpen = openId === job.id;

            return (
              <>
                <tr
                  key={job.id}
                  onClick={() => setOpenId(isOpen ? null : job.id)}
                  className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {job.title ?? "(no title)"}
                  </td>
                  <td className="px-4 py-3">{job.company ?? ""}</td>
                  <td className="px-4 py-3">{job.location ?? ""}</td>
                  <td className="px-4 py-3 font-semibold">{job.finalScore}</td>
                  <td className="px-4 py-3">{job.verdict ?? ""}</td>
                  <td className="px-4 py-3">
                    {job.salaryEstimateCzk
                      ? `${job.salaryEstimateCzk.toLocaleString("cs-CZ")} CZK`
                      : ""}
                  </td>
                  <td className="px-4 py-3">{job.status ?? ""}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {job.sourceFile ?? ""}
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
                          <span className="text-gray-500">Shortlisted:</span>{" "}
                          {job.isShortlisted ? "yes" : "no"}
                        </div>

                        <div>
                          <span className="text-gray-500">URL:</span>{" "}
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            open original
                          </a>
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
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}