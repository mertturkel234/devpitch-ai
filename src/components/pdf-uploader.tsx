"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface PdfUploaderProps {
  onUploadSuccess: (text: string) => void;
  onClear: () => void;
}

export function PdfUploader({ onUploadSuccess, onClear }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Lütfen sadece PDF dosyası yükleyin.");
        return;
      }
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Dosya yüklenemedi.");
      }

      toast.success("Özgeçmişiniz başarıyla okundu!");
      onUploadSuccess(data.text);
    } catch (err: any) {
      toast.error(err.message);
      setFileName(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearFile = () => {
    setFileName(null);
    onClear();
  };

  if (fileName) {
    return (
      <Card className="flex items-center justify-between p-3 border-accent/30 bg-accent/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 shrink-0 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
            <p className="text-xs text-muted">
              {isUploading ? "Okunuyor..." : "İçerik analize hazır"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearFile} disabled={isUploading} className="text-muted hover:text-danger shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:bg-surface/50 ${
        isDragging ? "border-accent bg-accent/5" : "border-border-subtle"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />
      <div className="mx-auto w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-4 border border-border-subtle shadow-sm text-muted">
        <FileText className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">
        LinkedIn Özgeçmişi (PDF) Yükle
      </h3>
      <p className="text-xs text-muted max-w-xs mx-auto">
        LinkedIn profilinizi PDF olarak kaydedin ve sürükleyip bırakın veya tıklayarak seçin.
      </p>
    </div>
  );
}
