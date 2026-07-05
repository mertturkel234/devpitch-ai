"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "tr" ? "en" : "tr";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted hover:text-foreground h-9 w-9 rounded-full"
      onClick={toggleLocale}
    >
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Switch Language</span>
    </Button>
  );
}
