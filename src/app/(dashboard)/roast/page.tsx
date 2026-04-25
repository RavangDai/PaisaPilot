"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { UploadZone } from "@/components/roast/upload-zone";
import { RoastResult } from "@/components/roast/roast-result";
import { Button } from "@/components/ui/button";

export default function RoastPage() {
  const [result, setResult] = useState<unknown>(null);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <TopNav title="Roast My Finances" />
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">
        <div>
          <p className="text-sm text-zinc-400">Upload a bank statement, CSV export, or budget spreadsheet. Get a brutally honest (but funny) AI analysis.</p>
        </div>

        {!result ? (
          <UploadZone onResult={setResult} />
        ) : (
          <div className="space-y-4">
            <RoastResult data={result as Parameters<typeof RoastResult>[0]["data"]} />
            <Button variant="outline" onClick={() => setResult(null)} className="w-full">
              Upload Another Statement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
