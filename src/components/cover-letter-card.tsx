"use client";

import { useState, useRef } from "react";
import { Check, Copy, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { RichTextEditor } from "@/components/rich-text-editor";

export function CoverLetterCard({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [template, setTemplate] = useState<"classic" | "modern" | "creative">("modern");
  const printRef = useRef<HTMLDivElement>(null);

  async function handleCopy() {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = editedContent;
      const plainText = tempDiv.innerText;

      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      toast.success("Cover letter panoya kopyalandı.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopyalama başarısız oldu.");
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Cover_Letter",
  });

  const templateClasses = {
    classic: "font-serif text-gray-900 bg-white p-8 border",
    modern: "font-sans text-foreground bg-transparent",
    creative: "font-mono text-foreground bg-accent/5 p-6 rounded-xl border-2 border-accent/20",
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-background/60 overflow-hidden flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-hover/50 gap-4">
        <div className="flex items-center gap-2 text-foreground">
          <Mail className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium">Cover Letter Editor</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as any)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
          >
            <option value="modern">Modern Şablon</option>
            <option value="classic">Klasik Şablon</option>
            <option value="creative">Yaratıcı Şablon</option>
          </select>
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
      
      {/* Editor Space */}
      <div className={`px-5 pb-5 transition-all ${templateClasses[template]}`}>
        <RichTextEditor content={editedContent} onChange={setEditedContent} />
      </div>

      {/* Hidden div for printing styled HTML without editor toolbar */}
      <div className="hidden">
        <div ref={printRef} className={`print-content p-10 ${templateClasses[template]}`} dangerouslySetInnerHTML={{ __html: editedContent }} />
      </div>
    </div>
  );
}
