"use client";

import { Fragment, useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JobSummary } from "@/lib/jobs/jobRepository";

type Props = {
  jobs: JobSummary[];
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  readOnly?: boolean;
  selectionMuted?: boolean;
};

function jobRowId(url: string) {
  return `job-${encodeURIComponent(url)}`;
}

function jobRowIdById(id: number) {
  return `job-id-${id}`;
}

export default function ExpandableJobTable({
  jobs,
  selectedIds,
  setSelectedIds,
  readOnly = false,
  selectionMuted = false,
}: Props) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const [privateNotes, setPrivateNotes] = useState<Record<number, string>>({});
  const [savedNoteIds, setSavedNoteIds] = useState<Set<number>>(new Set());
  const [savingNoteIds, setSavingNoteIds] = useState<Set<number>>(new Set());
  const [inactiveNoteIds, setInactiveNoteIds] = useState<Set<number>>(new Set());
  const [freshEvaluatedIds, setFreshEvaluatedIds] = useState<Set<number>>(
    new Set()
  );
  const [highlightedRowIds, setHighlightedRowIds] = useState<Set<number>>(
    new Set()
  );
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set());  
  
  const [openSelectionState, setOpenSelectionState] = useState<{
    id: number;
    wasSelected: boolean;
    wasChanged: boolean;
  } | null>(null);
  const visibleIds = useMemo(() => jobs.map((job) => job.id), [jobs]);

  const hasVisibleJobs = visibleIds.length > 0;

  const hasSelection = selectedIds.size > 0;

  
  function toggleAllVisible() {
    if (openId !== null && visibleIds.includes(openId)) {
      setOpenSelectionState((current) =>
        current && current.id === openId
          ? { ...current, wasChanged: true }
          : current
      );
    }

    setSelectedIds((current) => {
      const next = hasSelection ? new Set<number>() : new Set(visibleIds);
      return next;
    });
  }

  function toggleSelected(id: number) {
    if (openId === id) {
      setOpenSelectionState((current) =>
        current && current.id === id
          ? { ...current, wasChanged: true }
          : current
      );
    }

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

  function handleRowClick(id: number) {
    const currentlyOpenId = openId;
    const isClickingOpenRow = currentlyOpenId === id;
    const currentlyOpenJob = currentlyOpenId !== null
      ? jobs.find((item) => item.id === currentlyOpenId)
      : null;

    if (currentlyOpenId !== null && openSelectionState) {
      setSelectedIds((current) => {
        const next = new Set(current);

        if (!openSelectionState.wasChanged) {
          if (openSelectionState.wasSelected) {
            next.add(currentlyOpenId);
          } else {
            next.delete(currentlyOpenId);
          }
        }

        if (!isClickingOpenRow) {
          next.add(id);
        }

        return next;
      });
    } else {
      setSelectedIds((current) => {
        const next = new Set(current);

        if (!isClickingOpenRow) {
          next.add(id);
        }

        return next;
      });
    }

    if (isClickingOpenRow) {
      const job = jobs.find((item) => item.id === id);

      setOpenId(null);
      setOpenSelectionState(null);

      if (job?.status === "new" && !openSelectionState?.wasChanged) {
        setSeenIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });

        
        sessionStorage.setItem(
  "job-agent-highlight-ids",
  JSON.stringify([id])
);

setHighlightedRowIds(new Set([id]));

window.setTimeout(() => {
  const element = document.getElementById(jobRowIdById(id));

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, 100);

        void markAsSeen(id);
      }
      setFreshEvaluatedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });

      return;
    }

    if (currentlyOpenId !== null && !isClickingOpenRow) {
      setFreshEvaluatedIds((current) => {
        const next = new Set(current);
        next.delete(currentlyOpenId);
        return next;
      });
    }
    if (
      currentlyOpenId !== null &&
      !isClickingOpenRow &&
      currentlyOpenJob?.status === "new" && !openSelectionState?.wasChanged
    ) {
      setSeenIds((current) => {
        const next = new Set(current);
        next.add(currentlyOpenId);
        return next;
      });

sessionStorage.setItem(
  "job-agent-highlight-ids",
  JSON.stringify([currentlyOpenId])
);

setHighlightedRowIds(new Set([currentlyOpenId]));

      void markAsSeen(currentlyOpenId);
    }

    setOpenSelectionState({
      id,
      wasSelected: selectedIds.has(id),
      wasChanged: false,
    });

    const job = jobs.find((item) => item.id === id);

    setInactiveNoteIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setOpenId(id);
  }

async function handleStatusChange(status: string) {
  setHighlightedRowIds(new Set());

  const targetIds =
    selectedIds.size > 0
      ? Array.from(selectedIds)
      : openId !== null
        ? [openId]
        : [];

  if (targetIds.length === 0) {
    return;
  }

  const isOpenRowTargeted =
    openId !== null && targetIds.includes(openId);

  if (isOpenRowTargeted) {
    setOpenSelectionState((current) =>
      current && current.id === openId
        ? { ...current, wasChanged: true }
        : current
    );
  }

  const response = await fetch("/api/job-agent/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids: targetIds,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  const ids = [...targetIds].reverse();

  sessionStorage.setItem(
    "job-agent-highlight-ids",
    JSON.stringify(ids)
  );

  setSelectedIds(new Set());

  router.refresh();
}

  async function markAsSeen(id: number) {
    if (readOnly) {
      return;
    }
    try {
      const response = await fetch("/api/job-agent/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [id],
          status: "seen",
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  }

useEffect(() => {
  const targetUrl = sessionStorage.getItem("job-agent-scroll-url");
  const highlightedIds = sessionStorage.getItem("job-agent-highlight-ids");
  const scrollId = sessionStorage.getItem("job-agent-scroll-id");
  const freshIds = sessionStorage.getItem("job-agent-fresh-evaluated-ids");

  if (freshIds) {
    setFreshEvaluatedIds(new Set(JSON.parse(freshIds) as number[]));
    sessionStorage.removeItem("job-agent-fresh-evaluated-ids");
  }

  if (!targetUrl && !highlightedIds && !scrollId) {
  return;
}



  if (scrollId) {
    if (highlightedIds) {
      setHighlightedRowIds(
        new Set(JSON.parse(highlightedIds) as number[])
      );
    }

    window.setTimeout(() => {
      const element = document.getElementById(
        jobRowIdById(Number(scrollId))
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      sessionStorage.removeItem("job-agent-scroll-id");
    }, 100);

    return;
  }

  if (highlightedIds) {
    const ids = JSON.parse(highlightedIds) as number[];

    setHighlightedRowIds(new Set(ids));

    const firstElement = document.getElementById(
      jobRowIdById(ids[0])
    );

    if (firstElement) {
      firstElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return;
  }

if (targetUrl) {
  const job = jobs.find((item) => {
    const normalizedItemUrl = item.url
      .replace(/mock_app$/, "")
      .replace(/\/$/, "");

    return normalizedItemUrl === targetUrl;
  });

  const element = job
    ? document.getElementById(jobRowIdById(job.id))
    : null;

  if (job) {
    setHighlightedRowIds(new Set([job.id]));
  }

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  sessionStorage.removeItem("job-agent-scroll-url");
}

}, [jobs]);

async function savePrivateNote(id: number) {
  if (readOnly) {
    return;
  }
  setSavingNoteIds((current) => new Set(current).add(id));

  const response = await fetch("/api/job-agent/private-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      privateNote: privateNotes[id] ?? "",
    }),
  });

  setSavingNoteIds((current) => {
    const next = new Set(current);
    next.delete(id);
    return next;
  });

  if (!response.ok) {
    throw new Error("Failed to save private note");
  }

  setInactiveNoteIds((current) => {
    const next = new Set(current);
    next.add(id);
    return next;
  });

  setSavedNoteIds((current) => new Set(current).add(id));
}

  return (
    <div className="mt-4 h-full overflow-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-20 bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={hasSelection}
                disabled={readOnly || selectionMuted || !hasVisibleJobs}
                onChange={toggleAllVisible}
                className="h-4 w-4 cursor-pointer"
                aria-label="Select all visible jobs"
              />
            </th>
<th className="px-4 py-3">Status</th>
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
            const isUnreadLike = job.status === "new" || freshEvaluatedIds.has(job.id);

            return (
              <Fragment key={job.id}>
                <tr
                  id={jobRowIdById(job.id)}
                  onClick={() => handleRowClick(job.id)}
                  className={`scroll-mt-12 cursor-pointer border-b border-gray-100 job-row ${
                   !readOnly && highlightedRowIds.has(job.id)
                      ? "bg-yellow-50 hover:bg-yellow-100"
                      : "hover:bg-gray-50"
                  } ${
                    isUnreadLike ? "font-semibold" : ""
                  }`}                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelected(job.id)}
                      onClick={(event) => event.stopPropagation()}
className={`h-4 w-4 ${
  readOnly || selectionMuted
    ? "cursor-default opacity-40"
    : "cursor-pointer"
}`}
                      aria-label={`Select job ${job.id}`}
                      disabled={readOnly || selectionMuted}
                    />
                  </td>

                  <td className="px-4 py-3">{job.status ?? ""}</td>

                  <td className="px-4 py-3">
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
<Link
  href={
    readOnly
      ? `/applications/job-agent/public/jobs/${job.id}`
      : `/applications/job-agent/admin/jobs/${job.id}`
  }
  className="font-medium underline"
  onClick={(event) => {
    event.stopPropagation();

    sessionStorage.setItem(
      "job-agent-scroll-id",
      String(job.id)
    );

    if (!readOnly && job.status === "new") {
      void markAsSeen(job.id);
    }
  }}
>
  Open full detail
</Link>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="shrink-0 text-gray-500">Private note:</span>
<textarea
  disabled={readOnly}
  value={privateNotes[job.id] ?? job.privateNote ?? ""}
  onChange={(e) => {
    setInactiveNoteIds((current) => {
      const next = new Set(current);
      next.delete(job.id);
      return next;
    });

    setPrivateNotes((current) => ({
      ...current,
      [job.id]: e.target.value,
    }));
  }}
  onFocus={() => {
    setInactiveNoteIds((current) => {
      const next = new Set(current);
      next.delete(job.id);
      return next;
    });
  }}
  rows={1}
className={`flex-1 rounded border px-3 py-2 ${
  readOnly
    ? "cursor-default bg-gray-50 text-gray-400"
    : inactiveNoteIds.has(job.id)
    ? "text-gray-400"
    : "text-gray-900"
}`}
/>
<button
  type="button"
  onClick={() => savePrivateNote(job.id)}
  disabled={readOnly || savingNoteIds.has(job.id)}
  className={`rounded px-4 py-2 text-sm font-semibold transition active:translate-y-px active:scale-95 ${
    readOnly
      ? "cursor-default bg-gray-50 opacity-50"
      : `bg-blue-100 hover:bg-blue-200 ${
          savingNoteIds.has(job.id) ? "opacity-60" : ""
        }`
  }`}
>
  Save
</button>
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