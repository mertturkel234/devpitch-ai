"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut } from "lucide-react";

export function UserNav() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted hover:text-foreground"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {status === "loading" ? (
        <div className="h-8 w-8 rounded-full bg-surface animate-pulse" />
      ) : session?.user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src={session.user.image || ""}
              alt={session.user.name || "User"}
              className="h-8 w-8 rounded-full border border-border-subtle"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 text-muted hover:text-foreground" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      ) : (
        <Button onClick={() => signIn("github")}>Giriş Yap</Button>
      )}
    </div>
  );
}
