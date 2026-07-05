"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  FileText,
  ArrowLeft,
  Star,
  GitBranch,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getGithubProfile } from "@/app/actions/github";
import { generateCoverLetter } from "@/app/actions/generate-pitch";
import { CoverLetterCard } from "@/components/cover-letter-card";
import { PaywallModal } from "@/components/paywall-modal";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSession } from "next-auth/react";
import type { GithubProfile } from "@/types/github";

type Stage = "idle" | "fetching-github" | "generating" | "done";

export default function DashboardClient({ initialCredits }: { initialCredits: number }) {
  const [username, setUsername] = useState("");
  const [jobPost, setJobPost] = useState("");
  const [language, setLanguage] = useState("İngilizce");
  const [tone, setTone] = useState("Profesyonel");
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [isPending, startTransition] = useTransition();
  const [credits, setCredits] = useState(initialCredits);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const { data: session } = useSession();

  const isLoading = stage === "fetching-github" || stage === "generating";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    if (credits <= 0) {
      setPaywallOpen(true);
      return;
    }

    setLetter(null);
    setProfile(null);

    startTransition(async () => {
      setStage("fetching-github");
      const profileResult = await getGithubProfile(username);

      if (!profileResult.success) {
        toast.error(profileResult.error);
        setStage("idle");
        return;
      }

      setProfile(profileResult.data);
      setStage("generating");

      const letterResult = await generateCoverLetter(profileResult.data, jobPost, language, tone);

      if (!letterResult.success) {
        toast.error(letterResult.error);
        setStage("done");
        return;
      }

      setLetter(letterResult.data);
      setCredits((prev) => Math.max(0, prev - 1));
      toast.success("Cover letter'ınız hazır.");
      setStage("done");
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader credits={credits} />

      <main className="flex-1 bg-grid">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Başvurunuzu oluşturun
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              GitHub kullanıcı adınızı ve hedef ilanı girin, gerisini yapay zekaya bırakın.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">GitHub Kullanıcı Adı</Label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      id="username"
                      placeholder="örn. torvalds"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-post">İş İlanı Metni</Label>
                  <Textarea
                    id="job-post"
                    placeholder="İlanın tamamını buraya yapıştırın..."
                    value={jobPost}
                    onChange={(e) => setJobPost(e.target.value)}
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Dil</Label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="İngilizce">İngilizce</option>
                      <option value="Türkçe">Türkçe</option>
                      <option value="Almanca">Almanca</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Ton</Label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Profesyonel">Profesyonel</option>
                      <option value="Heyecanlı ve Enerjik">Heyecanlı</option>
                      <option value="Kısa ve Öz">Kısa ve Öz</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                >
                  {stage === "fetching-github" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      GitHub analiz ediliyor...
                    </>
                  ) : stage === "generating" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cover letter yazılıyor...
                    </>
                  ) : credits <= 0 ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Pro'ya Geç
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Cover Letter Oluştur
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <Card className="p-6 min-h-[520px] flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {stage === "idle" && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <EmptyState />
                  </motion.div>
                )}
                {isLoading && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <ResultSkeleton
                      label={
                        stage === "fetching-github"
                          ? "GitHub verileriniz analiz ediliyor..."
                          : "Yapay zeka cover letter'ınızı yazıyor..."
                      }
                    />
                  </motion.div>
                )}
                {stage === "done" && profile && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col gap-5"
                  >
                    <GithubProfileSummary profile={profile} />
                    {letter && <CoverLetterCard content={letter} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </main>

      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </div>
  );
}

function DashboardHeader({ credits }: { credits: number }) {
  return (
    <header className="border-b border-border-subtle bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-mono text-xs font-bold">D</span>
            </div>
            <span className="font-semibold tracking-tight text-foreground hidden sm:inline">
              DevPitch.ai
            </span>
          </Link>
          <Link href="/app/history" className="text-sm font-medium hover:underline text-muted hover:text-foreground">
            Geçmiş
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={credits === 0 ? "outline" : "secondary"}
            className={cn("font-mono", credits === 0 && "border-danger/40 text-danger")}
          >
            {credits} kredi
          </Badge>
          <LanguageSwitcher />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
      <div className="h-14 w-14 rounded-2xl bg-accent-dim text-accent flex items-center justify-center mb-5">
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="font-medium text-foreground mb-1.5">
        Sonucunuz burada görünecek
      </h3>
      <p className="text-sm text-muted max-w-xs">
        Formu doldurup gönderdiğinizde, mektubunuz burada oluşacak.
      </p>
    </div>
  );
}

function ResultSkeleton({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 text-accent animate-spin" />
          <span className="text-xs font-mono text-muted uppercase tracking-wide">
            {label}
          </span>
        </div>
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
      <div className="space-y-2.5 mb-6">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

function GithubProfileSummary({ profile }: { profile: GithubProfile }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-success">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-mono uppercase tracking-wide">
          GitHub profili analiz edildi
        </span>
      </div>
      <div className="flex items-start gap-3 mb-4">
        <img
          src={profile.avatarUrl}
          alt={profile.username}
          className="h-11 w-11 rounded-full border border-border-subtle"
        />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">
            {profile.name || profile.username}
            <span className="text-muted font-mono text-xs ml-2">@{profile.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
