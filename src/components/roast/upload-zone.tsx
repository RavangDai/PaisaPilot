"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";
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
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 cursor-pointer transition-colors",
          isDragActive ? "border-emerald-500 bg-emerald-900/10" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            <FileText className="h-10 w-10 text-emerald-400 mb-3" />
            <p className="font-medium text-zinc-100">{file.name}</p>
            <p className="text-sm text-zinc-400">{(file.size / 1024).toFixed(1)} KB</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-zinc-500 mb-3" />
            <p className="font-medium text-zinc-300">Drop your financial statement here</p>
            <p className="text-sm text-zinc-500 mt-1">CSV, TXT, or PDF — up to 5MB</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {file && (
        <Button onClick={handleRoast} disabled={loading} className="w-full" size="lg">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Roasting your finances...</> : "🔥 Roast My Finances"}
        </Button>
      )}
    </div>
  );
}
