import { getTranslations } from "next-intl/server";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckoutSession } from "@/app/actions/stripe";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: "Fiyatlandırma" };
}

export default async function PricingPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Basit ve Şeffaf Fiyatlandırma
        </h1>
        <p className="text-lg text-muted">
          Gizli ücret yok, abonelik yok. Yalnızca ihtiyacınız olduğu kadar kredi alın ve hayalinizdeki işe başvurun.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Ücretsiz Plan */}
        <Card className="p-8 border border-border-subtle bg-surface/50 relative overflow-hidden flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Başlangıç Paketi</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted">/ tek seferlik</span>
            </div>
          </div>
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span>3 ücretsiz kapak mektubu (Kayıt olunca anında)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span>GitHub Profil Analizi</span>
            </li>
            <li className="flex items-start gap-3 text-muted">
              <Check className="h-5 w-5 opacity-50 shrink-0" />
              <span>LinkedIn Entegrasyonu (Sınırlı)</span>
            </li>
          </ul>
          <Button variant="outline" size="lg" className="w-full" disabled>
            Kayıtta Tanımlanır
          </Button>
        </Card>

        {/* Pro Plan */}
        <Card className="p-8 border-2 border-accent relative overflow-hidden flex flex-col shadow-xl shadow-accent/5">
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            En Popüler
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              Pro Paket
              <Sparkles className="h-4 w-4 text-accent" />
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">$5.00</span>
              <span className="text-muted">/ tek seferlik</span>
            </div>
            <p className="text-sm text-muted mt-2">Kredileriniz hiçbir zaman silinmez.</p>
          </div>
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span className="font-medium text-foreground">10 adet ekstra kapak mektubu kredisi</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span>Gelişmiş LinkedIn PDF Analizi</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span>Sınırsız Şablon (Modern, Klasik, Yaratıcı)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <span>Kanban Board ile Başvuru Takibi</span>
            </li>
          </ul>
          
          <form action={async () => {
            "use server";
            const session = await auth();
            if (!session) redirect("/");
            const res = await createCheckoutSession();
            if (res.success && res.url) {
              redirect(res.url);
            }
          }}>
            <Button size="lg" className="w-full relative overflow-hidden group">
              <span className="relative z-10 flex items-center gap-2">
                Hemen Kredi Satın Al <Zap className="h-4 w-4" />
              </span>
            </Button>
          </form>
        </Card>
      </div>

      <div className="mt-16 flex items-center justify-center gap-2 text-sm text-muted">
        <ShieldCheck className="h-4 w-4 text-success" />
        Güvenli ödeme altyapısı Stripe tarafından sağlanmaktadır.
      </div>
    </div>
  );
}
