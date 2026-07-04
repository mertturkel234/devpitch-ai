"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "devpitch:credits";
const FREE_CREDITS = 3;

export function useCredits() {
  // İlk render'da (SSR ile uyumlu) varsayılan olarak tam krediyi göster,
  // gerçek değeri mount sonrası localStorage'dan okuruz.
  const [credits, setCredits] = useState<number>(FREE_CREDITS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed)) {
          setCredits(parsed);
        }
      } else {
        window.localStorage.setItem(STORAGE_KEY, String(FREE_CREDITS));
      }
    } catch {
      // localStorage kullanılamıyorsa (gizli sekme vb.) varsayılan kredilerle devam et.
    } finally {
      setIsReady(true);
    }
  }, []);

  const consumeCredit = useCallback(() => {
    setCredits((prev) => {
      const next = Math.max(0, prev - 1);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* no-op */
      }
      return next;
    });
  }, []);

  const hasCredits = credits > 0;

  return { credits, hasCredits, consumeCredit, isReady, freeCredits: FREE_CREDITS };
}
