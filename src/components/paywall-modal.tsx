"use client";

import { useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/actions/stripe";

const PRO_PERKS = [
  "10 adet yeni cover letter oluşturma hakkı",
  "Yapay zeka dil ve ton seçimi",
  "Geçmiş başvuruları kaydetme ve PDF çıktı",
];

export function PaywallModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await createCheckoutSession();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Ödeme oturumu başlatılamadı.");
      }
    } catch {
      toast.error("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex justify-center mb-1">
          <div className="h-12 w-12 rounded-2xl bg-accent-dim text-accent flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-xl">Krediniz Bitti</DialogTitle>
          <DialogDescription>
            Yeni cover letter oluşturmak için kredi satın almalısınız.
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-5 space-y-2.5">
          {PRO_PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm text-foreground">
              <span className="h-4 w-4 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <Button size="lg" className="w-full mt-6" onClick={handleUpgrade} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          10 Kredi Satın Al — $5.00
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          Tek seferlik ödeme · anında aktivasyon
        </p>
      </DialogContent>
    </Dialog>
  );
}
