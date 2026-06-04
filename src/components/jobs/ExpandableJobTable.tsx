"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JobSummary } from "@/lib/jobs/jobRepository";

type Props = {
  jobs: JobSummary[];
};

const STATUS_OPTIONS = [
  "delete",
  "new",
  "prepared",
  "evaluated",
  "applied",
  "renew",
  "rejected",
  "skipped",
];

function jobRowId(url: string) {
  return `job-${encodeURIComponent(url)}`;
}

function jobRowIdById(id: number) {
  return `job-id-${id}`;
}

export default function ExpandableJobTable({ jobs }: Props) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const visibleIds = useMemo(() => jobs.map((job) => job.id), [jobs]);

  const hasVisibleJobs = visibleIds.length > 0;

  const hasSelection = selectedIds.size > 0;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsStatusMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);  
  
  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (hasSelection) {
        return new Set();
      }

      return new Set(visibleIds);
    });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  async function handleStatusChange(status: string) {
    if (selectedIds.size === 0) {
      return;
    }

    const response = await fetch("/api/job-agent/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: Array.from(selectedIds),
        status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const ids = Array.from(selectedIds).reverse();

    sessionStorage.setItem(
      "job-agent-highlight-ids",
      JSON.stringify(ids)
    );

    setIsStatusMenuOpen(false);
    setSelectedIds(new Set());

    router.refresh();  
  }

useEffect(() => {
  const targetUrl = sessionStorage.getItem("job-agent-scroll-url");
  const highlightedIds = sessionStorage.getItem("job-agent-highlight-ids");

  if (!targetUrl && !highlightedIds) {
    return;
  }

  document
    .querySelectorAll(".job-agent-highlight")
    .forEach((el) =>
      el.classList.remove(
      "job-agent-highlight",
      "bg-yellow-50",
      "hover:bg-yellow-100"
    )
    );

  if (highlightedIds) {
    const ids = JSON.parse(highlightedIds) as number[];
    const elements = ids
      .map((id) => document.getElementById(jobRowIdById(id)))
      .filter((element): element is HTMLElement => element !== null);

    const firstElement = elements[0];

    if (firstElement) {
      firstElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    elements.forEach((element) => {
      element.classList.add(
        "job-agent-highlight",
        "bg-yellow-50",
        "hover:bg-yellow-100"
      );
    });

    sessionStorage.removeItem("job-agent-highlight-ids");
    return;
  }

  if (targetUrl) {
    const job = jobs.find(
      (item) => item.url.replace(/\/$/, "") === targetUrl
    );

    const element = job
      ? document.getElementById(jobRowIdById(job.id))
      : null;

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.add("job-agent-highlight", "bg-yellow-50");
    }

    sessionStorage.removeItem("job-agent-scroll-url");
  }
}, [jobs]);

  return (
    <div className="mt-4 h-full overflow-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-20 bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={hasSelection}
                disabled={!hasVisibleJobs}
                onChange={toggleAllVisible}
                className="h-4 w-4 cursor-pointer"
                aria-label="Select all visible jobs"
              />
            </th>
            <th
              className={`relative px-4 py-3 ${
                hasSelection ? "cursor-pointer bg-blue-100" : ""
              }`}
              onClick={() => {
                if (!hasSelection) {
                  return;
                }

                setIsStatusMenuOpen((current) => !current);
              }}
            >
              <span>Status
              </span>

              {hasSelection && isStatusMenuOpen ? (
                <div className="absolute left-4 top-full z-30 mt-1 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleStatusChange(status);
                      }}
                      className="block w-full px-3 py-1 text-left text-sm hover:bg-gray-50"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              ) : null}
            </th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Verdict</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">URL</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => {
            const isOpen = openId === job.id;
            const isSelected = selectedIds.has(job.id);

            return (
              <Fragment key={job.id}>
                <tr
                  id={jobRowIdById(job.id)}
                  onClick={() => setOpenId(isOpen ? null : job.id)}
                  className="scroll-mt-12 cursor-pointer border-b border-gray-100 hover:bg-gray-50 job-row"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelected(job.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="h-4 w-4 cursor-pointer"
                      aria-label={`Select job ${job.id}`}
                    />
                  </td>

                  <td className="px-4 py-3">{job.status ?? ""}</td>

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