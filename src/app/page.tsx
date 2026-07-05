import Link from "next/link";
import { ArrowRight, Target, FileText } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { PitchFlow } from "@/components/landing/pitch-flow";
import { HeroContent } from "@/components/landing/hero-content";
import { Reveal } from "@/components/motion/reveal";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-grid">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-accent/[0.08] to-transparent" />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <HeroContent />
            <PitchFlow />
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="border-t border-border-subtle">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal className="max-w-xl mb-14">
            <h2 className="text-3xl font-semibold tracking-tight">
              Üç adımda gönderime hazır
            </h2>
            <p className="mt-3 text-muted">
              Boş bir sayfayla değil, GitHub'daki gerçek işinizle başlayın.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <FeatureCard
                icon={<GithubIcon className="h-5 w-5" />}
                title="Profilinizi bağlayın"
                description="GitHub kullanıcı adınızı girin; en çok yıldız alan repolarınız, dilleriniz ve biyografiniz otomatik çekilir."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <FeatureCard
                icon={<Target className="h-5 w-5" />}
                title="İlanı yapıştırın"
                description="Başvurmak istediğiniz iş ilanının metnini ekleyin. Yapay zeka gereksinimleri projelerinizle eşleştirir."
              />
            </Reveal>
            <Reveal delay={0.2}>
              <FeatureCard
                icon={<FileText className="h-5 w-5" />}
                title="Mektubunuzu alın"
                description="Somut proje örnekleriyle desteklenen, profesyonel bir İngilizce cover letter saniyeler içinde hazır."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Bir sonraki başvurunuz farklı olsun
            </h2>
            <p className="mt-3 text-muted max-w-md mx-auto">
              İlk 3 başvuru ücretsiz. Kurulum yok, kayıt formu yok.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/app">
                DevPitch.ai&apos;ı Dene <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-mono text-xs font-bold">
              D
            </span>
          </div>
          <span className="font-semibold tracking-tight">DevPitch.ai</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/app"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:inline"
          >
            Dashboard
          </Link>
          <ThemeToggle />
          <UserNav />
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <span>© {new Date().getFullYear()} DevPitch.ai</span>
        <span className="font-mono">GitHub REST API · OpenAI ile çalışır</span>
      </div>
    </footer>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border-subtle bg-surface p-6 transition-colors duration-200 hover:border-accent/30 hover:bg-surface-hover">
      <div className="h-10 w-10 rounded-lg bg-accent-dim text-accent flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
