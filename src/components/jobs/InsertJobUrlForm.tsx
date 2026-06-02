"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InsertJobUrlForm() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [busyMode, setBusyMode] = useState<"prepare" | "evaluate" | null>(null);
  const [message, setMessage] = useState("");

  async function run(mode: "prepare" | "evaluate") {
    if (!url.trim()) {
      setMessage("URL is required");
      return;
    }

    setBusyMode(mode);
    setMessage("");

    try {
      const response = await fetch(`/api/job-agent/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
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
        url.trim().replace(/\/$/, "")
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
          className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-sm disabled:opacity-50"
        >
          {busyMode === "prepare" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          )}
          Prepare
        </button>

        <button
          disabled={busyMode !== null}
          onClick={() => run("evaluate")}
          className="flex items-center gap-2 rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {busyMode === "evaluate" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          Evaluate
        </button>
      </div>

      {message && <div className="text-sm text-gray-500">{message}</div>}
    </div>
  );
}