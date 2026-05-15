"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

/**
 * Why the mounted state?
 * On the server, we don't know the user's theme preference.
 * If we render the toggle immediately, the server renders one
 * state and the client renders another — hydration mismatch.
 *
 * By waiting until mounted (client-only), we only render the
 * toggle after we know the real theme. This is the standard
 * pattern for any component that reads from localStorage or
 * system preferences.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border p-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
    >
      <button
        onClick={() => setTheme("light")}
        title="Light mode"
        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        style={{
          background: theme === "light" ? "var(--bg-surface)" : "transparent",
          color: theme === "light" ? "var(--green)" : "var(--fg-muted)",
        }}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        title="System preference"
        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        style={{
          background: theme === "system" ? "var(--bg-surface)" : "transparent",
          color: theme === "system" ? "var(--green)" : "var(--fg-muted)",
        }}
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        title="Dark mode"
        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        style={{
          background: theme === "dark" ? "var(--bg-surface)" : "transparent",
          color: theme === "dark" ? "var(--green)" : "var(--fg-muted)",
        }}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}