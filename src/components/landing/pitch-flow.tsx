"use client";

import { motion } from "framer-motion";
import { GitBranch, Star, Code2, ArrowRight, Sparkles } from "lucide-react";

const repos = [
  { name: "realtime-api-gateway", lang: "Go", stars: 412 },
  { name: "distributed-cache", lang: "Rust", stars: 218 },
  { name: "ml-pipeline-orchestrator", lang: "Python", stars: 156 },
];

export function PitchFlow() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="relative rounded-2xl border border-border-subtle bg-surface/60 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Pencere başlığı */}
        <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3f]" />
          <span className="ml-3 font-mono text-[11px] text-muted">
            github.com/username
          </span>
        </div>

        {/* Repo listesi -> ok -> mektup satırı */}
        <div className="p-5 space-y-2.5">
          {repos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-background/60 px-3 py-2.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <GitBranch className="h-3.5 w-3.5 text-muted shrink-0" />
                <span className="font-mono text-xs text-foreground truncate">
                  {repo.name}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 pl-3">
                <Badge label={repo.lang} />
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </span>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center py-1"
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1.5 text-accent"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] tracking-wider uppercase">
                analiz ediliyor
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="rounded-lg border border-accent/30 bg-accent-dim px-3.5 py-3 space-y-1.5"
          >
            <div className="flex items-center gap-1.5 text-accent mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Cover Letter — Taslak</span>
            </div>
            <div className="h-1.5 w-[92%] rounded-full bg-foreground/15" />
            <div className="h-1.5 w-[78%] rounded-full bg-foreground/15" />
            <div className="h-1.5 w-[85%] rounded-full bg-foreground/10" />
          </motion.div>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -inset-8 -z-10 bg-accent/10 blur-3xl rounded-full" />
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted border border-border-subtle">
      {label}
    </span>
  );
}
