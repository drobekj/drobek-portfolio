"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InsertJobUrlForm({
  hasSelection,
  selectedIds,
  clearSelection,
}: {
  hasSelection: boolean;
  selectedIds: number[];
  clearSelection: () => void;
}) {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [busyMode, setBusyMode] = useState<"prepare" | "evaluate" | null>(null);
  const [message, setMessage] = useState("");

  async function run(mode: "prepare" | "evaluate") {
    const trimmedUrl = url.trim();

    if (!trimmedUrl && !(mode === "evaluate" && selectedIds.length > 0)) {
      setMessage("URL is required");
      return;
    }

    if (!trimmedUrl && mode === "evaluate" && selectedIds.length > 0) {
      setBusyMode(mode);
      setMessage("");

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
          setMessage(data.error ?? "Unknown error");
          return;
        }

        setMessage(data.output ?? "Bulk evaluate updated");

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
        setMessage("Request failed");
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
    setMessage("");

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
        setMessage(data.error ?? "Unknown error");
        return;
      }

      setMessage(data.output ?? "Success");
      setUrl("");

      sessionStorage.setItem(
        "job-agent-scroll-url",
        trimmedUrl.replace(/\/$/, "")
      );
      
      router.refresh();
    } catch {
      setMessage("Request failed");
    } finally {
      setBusyMode(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busyMode !== null}
          placeholder="Insert URL"
          className="w-[420px] rounded border px-3 py-2 text-sm disabled:bg-gray-100"
        />

        <button
          disabled={busyMode !== null}
          onClick={() => run("prepare")}
          className="flex items-center gap-2 rounded bg-gray-50 px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          {busyMode === "prepare" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          )}
          Prepare
        </button>

        <button
          disabled={busyMode !== null}
          onClick={() => run("evaluate")}
          className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            hasSelection
              ? "bg-blue-100 hover:bg-blue-200"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
          >
          {busyMode === "evaluate" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          )}
          Evaluate
        </button>
      </div>

      {message && <div className="text-sm text-gray-500">{message}</div>}
    </div>
  );
}