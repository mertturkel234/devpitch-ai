"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

export function CoverLetterCard({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Cover letter panoya kopyalandı.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopyalama başarısız oldu. Metni manuel seçmeyi deneyin.");
    }
  }

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Cover_Letter",
  });

  return (
    <div className="rounded-lg border border-border-subtle bg-background/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-hover/50">
        <div className="flex items-center gap-2 text-foreground">
          <Mail className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium">Cover Letter</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handlePrint()}>
            <Download className="h-3.5 w-3.5 mr-1" />
            PDF İndir
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Kopyala
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="px-5 py-4 prose-letter bg-white dark:bg-background text-black dark:text-foreground" ref={contentRef}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
