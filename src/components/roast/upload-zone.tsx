"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onResult: (data: unknown) => void;
}

export function UploadZone({ onResult }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setError(""); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "text/plain": [".txt"], "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  async function handleRoast() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/roast", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) setError(data.error);
      else onResult(data);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all",
          isDragActive
            ? "border-[#1B5E39] bg-[#EAF4EE]"
            : "border-[#D5DAD7] bg-[#F8FAF9] hover:border-[#1B5E39]/50 hover:bg-[#EAF4EE]/50"
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4EE] mb-3">
              <FileText className="h-6 w-6 text-[#1B5E39]" />
            </div>
            <p className="font-semibold text-[#111917] text-sm">{file.name}</p>
            <p className="text-xs text-[#5A6A62] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-2 flex items-center gap-1 text-xs text-[#94A39A] hover:text-red-500"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4E7E5] mb-3">
              <Upload className="h-5 w-5 text-[#5A6A62]" />
            </div>
            <p className="font-semibold text-sm text-[#111917]">
              {isDragActive ? "Drop it here!" : "Drop your statement here"}
            </p>
            <p className="text-xs text-[#5A6A62] mt-1">or click to browse</p>
            <p className="text-[11px] text-[#94A39A] mt-3">CSV, TXT, or PDF — up to 5 MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {file && (
        <Button onClick={handleRoast} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing your finances…</>
          ) : (
            "🔥 Roast My Finances"
          )}
        </Button>
      )}
    </div>
  );
}
