"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { UploadZone } from "@/components/roast/upload-zone";
import { RoastResult } from "@/components/roast/roast-result";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function RoastPage() {
  const [result, setResult] = useState<unknown>(null);

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Roast My Finances" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="rounded-2xl border border-[#E4E7E5] bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Flame className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#111917]">Roast My Finances</p>
                <p className="text-xs text-[#5A6A62]">
                  Upload a bank statement for a brutally honest AI review
                </p>
              </div>
            </div>

            {!result ? (
              <UploadZone onResult={setResult} />
            ) : (
              <div className="space-y-4">
                <RoastResult data={result as Parameters<typeof RoastResult>[0]["data"]} />
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="w-full"
                >
                  Upload Another Statement
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
