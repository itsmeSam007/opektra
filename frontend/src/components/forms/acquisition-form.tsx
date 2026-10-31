"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const schema = z.object({
  inquiry_type: z.literal("acquisition"),
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.string().optional(),
  message: z.string().min(10),
  budget_range: z.string().optional(),
  nda_acknowledged: z.boolean().refine((v) => v === true, { message: "NDA acknowledgment is required" }),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AcquisitionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inquiry_type: "acquisition", website: "", nda_acknowledged: false },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await api.inquiries.submit(data as unknown as Record<string, string | boolean>);
      setStatus("success");
      setMessage(res.message);
      reset({ inquiry_type: "acquisition", website: "" });
    } catch {
      setStatus("error");
      setMessage("Submission failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register("inquiry_type")} />
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="acq-name">Full Name</Label>
          <Input id="acq-name" {...register("name")} />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="acq-email">Work Email</Label>
          <Input id="acq-email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="acq-company">Company</Label>
          <Input id="acq-company" {...register("company")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acq-role">Role</Label>
          <Input id="acq-role" {...register("role")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="acq-budget">Budget Range (optional)</Label>
        <Input id="acq-budget" placeholder="e.g. $500K - $2M" {...register("budget_range")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acq-message">Confidential message</Label>
        <Textarea id="acq-message" rows={5} {...register("message")} />
        {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register("nda_acknowledged")} className="mt-1" />
        <span>
          I acknowledge that this submission is confidential and agree to the{" "}
          <Link href="/legal/licensing" className="text-accent underline">NDA terms</Link> for acquisition discussions.
        </span>
      </label>
      {errors.nda_acknowledged && <p className="text-xs text-red-400">{errors.nda_acknowledged.message}</p>}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit Acquisition Inquiry"}
      </Button>

      {status === "success" && <p className="text-sm text-green-400">{message}</p>}
      {status === "error" && <p className="text-sm text-red-400">{message}</p>}
    </form>
  );
}
