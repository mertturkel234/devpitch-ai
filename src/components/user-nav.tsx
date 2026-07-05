"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Moon, Sun, LogOut } from "lucide-react";

export function UserNav() {
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center gap-4">
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
