"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle theme">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} aria-current={theme === "light" ? "true" : undefined}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} aria-current={theme === "dark" ? "true" : undefined}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} aria-current={theme === "system" ? "true" : undefined}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
