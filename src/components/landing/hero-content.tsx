"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeroContent() {
  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <motion.div variants={item}>
        <Badge className="mb-6">
          <Zap className="h-3 w-3" />
          GitHub verilerinizle çalışır
        </Badge>
      </motion.div>

      <motion.h1
        variants={item}
        className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.08] text-foreground"
      >
        GitHub profilinizi{" "}
        <span className="text-accent">yurt dışı iş tekliflerine</span>{" "}
        dönüştürün
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 text-lg text-muted leading-relaxed max-w-lg"
      >
        Kullanıcı adınızı ve hedef ilanı yapıştırın. Yapay zeka,
        repolarınızdan somut örnekler seçip ilana özel, İngilizce bir cover
        letter yazsın — siz sadece gönderin.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-9 flex flex-wrap items-center gap-3"
      >
        <Button size="lg" asChild>
          <Link href="/app">
            Ücretsiz Dene <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <a href="#nasil-calisir">Nasıl çalışır?</a>
        </Button>
      </motion.div>

      <motion.p variants={item} className="mt-4 text-xs text-muted font-mono">
        3 ücretsiz deneme · kredi kartı gerekmez
      </motion.p>
    </motion.div>
  );
}
