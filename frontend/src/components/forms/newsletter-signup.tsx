"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage("Please agree to receive updates.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, website: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setStatus("success");
      setMessage(data.message);
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "space-y-4"}>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className={compact ? "flex flex-col gap-2 sm:flex-row" : "space-y-2"}>
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={compact ? "sm:flex-1" : ""}
        />
        <Button type="submit" disabled={status === "loading"} className={compact ? "shrink-0" : ""}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>
          I agree to receive product and content updates. See our{" "}
          <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
        </span>
      </label>
      {status === "success" && <p className="text-sm text-green-400">{message}</p>}
      {status === "error" && <p className="text-sm text-red-400">{message}</p>}
    </form>
  );
}
