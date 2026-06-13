"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InsertJobUrlForm({
  hasSelection,
  selectedIds,
  selectedAlreadyEvaluatedCount,
  clearSelection,
  setToolbarMessage,
  readOnly = false,
  urlModeActive,
  setUrlModeActive,
}: {
  hasSelection: boolean;
  selectedIds: number[];
  selectedAlreadyEvaluatedCount: number;
  clearSelection: () => void;
  setToolbarMessage: (message: string) => void;
  readOnly?: boolean;
  urlModeActive: boolean;
  setUrlModeActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const hasUrl = url.trim().length > 0;
  const [busyMode, setBusyMode] = useState<"prepare" | "evaluate" | null>(null);
  
async function run(
  mode: "prepare" | "evaluate",
  forceUrlMode = false
) {
  const trimmedUrl = url.trim();
  const isUrlMode = forceUrlMode || urlModeActive;

  sessionStorage.removeItem("job-agent-highlight-ids");
  sessionStorage.removeItem("job-agent-fresh-evaluated-ids");
  setToolbarMessage("");

  if (isUrlMode && !trimmedUrl) {
    setToolbarMessage("URL is required");
    return;
  }

  if (!isUrlMode && mode === "prepare") {
    setToolbarMessage("Click into the URL field first");
    return;
  }

  if (!isUrlMode && mode === "evaluate" && selectedIds.length === 0) {
    setToolbarMessage("Select at least one job");
    return;
  }

  if (!isUrlMode && mode === "evaluate") {
    if (selectedAlreadyEvaluatedCount > 0) {
      const confirmed = window.confirm(
        `${selectedAlreadyEvaluatedCount} selected job(s) already have an evaluation.\n\nBulk evaluation will re-run the AI agent and may consume tokens.\n\nContinue?`
      );

      if (!confirmed) {
        return;
      }
    }

    setBusyMode(mode);
    setToolbarMessage("");

    try {
      const response = await fetch("/api/job-agent/bulk-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json();

      if (!data.ok) {
        setToolbarMessage(data.error ?? "Unknown error");
        return;
      }

      setToolbarMessage(data.output ?? "Bulk evaluate updated");

      sessionStorage.setItem(
        "job-agent-highlight-ids",
        JSON.stringify([...selectedIds].reverse())
      );

            sessionStorage.setItem(
        "job-agent-fresh-evaluated-ids",
        JSON.stringify(selectedIds)
      );

      clearSelection();

      router.refresh();
    } catch {
      setToolbarMessage("Request failed");
    } finally {
      setBusyMode(null);
    }

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

  setBusyMode(mode);
  setToolbarMessage("");

  try {
    const response = await fetch(`/api/job-agent/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: trimmedUrl }),
    });

    const data = await response.json();

    if (!data.ok) {
      setToolbarMessage(data.error ?? "Unknown error");
      return;
    }

    setToolbarMessage(data.output ?? "Success");
    setUrl("");
    setUrlModeActive(false);

    sessionStorage.setItem(
      "job-agent-scroll-url",
      trimmedUrl.replace(/\/$/, "")
    );

    router.refresh();
  } catch {
    setToolbarMessage("Request failed");
  } finally {
    setBusyMode(null);
  }
}

  return (
    <div className="flex min-w-0 items-center gap-2">      
        <button
          disabled={
            readOnly ||
            busyMode !== null ||
            (!urlModeActive && !hasSelection)
          }
          onMouseDown={(event) => {
  if (urlModeActive) {
    event.preventDefault();
    void run("evaluate", true);
  }
}}
onClick={() => {
  if (!urlModeActive) {
    void run("evaluate");
  }
}}
          className={`flex w-[92px] shrink-0 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold text-black transition-colors disabled:opacity-50 ${
            !readOnly && (urlModeActive || hasSelection)
              ? "bg-blue-100 hover:bg-blue-200"
              : "bg-gray-50 opacity-50 hover:bg-gray-100"
          }`}
        >
          {busyMode === "evaluate" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          )}
          Evaluate
        </button>

        <button
          disabled={readOnly || busyMode !== null || !urlModeActive}
          onMouseDown={(event) => {
  event.preventDefault();
  void run("prepare", true);
}}
          className={`flex w-[92px] shrink-0 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold text-black transition-colors disabled:opacity-50 ${
          !readOnly && urlModeActive
            ? "bg-blue-100 hover:bg-blue-200"
            : "bg-gray-50 opacity-50 hover:bg-gray-100"
            }`}
        >
          {busyMode === "prepare" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          )}
          Prepare
        </button>

        <input
          value={url}
            onFocus={() => {
              setUrlModeActive(true);
            }}
            onChange={(event) => {
            const nextValue = event.target.value;

            setUrl(nextValue);

            if (nextValue.trim()) {
              setUrlModeActive(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              if (urlModeActive) {
                setUrlModeActive(false);
              }
            }, 0);
          }}
          disabled={readOnly || busyMode !== null}
          placeholder="Insert URL"
          className={`min-w-0 flex-1 rounded border px-3 py-2 text-sm disabled:bg-gray-100 ${
            urlModeActive ? "text-gray-900" : "text-gray-400"
          }`}
        />

    </div>
  );
}