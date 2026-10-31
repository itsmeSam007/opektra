"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const schema = z.object({
  inquiry_type: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.string().optional(),
  message: z.string().min(10),
  budget_range: z.string().optional(),
  nda_acknowledged: z.boolean().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface InquiryFormProps {
  type: "demo" | "licensing" | "acquisition";
  title: string;
}

const TYPE_LABELS = {
  demo: "Demo Request",
  licensing: "Licensing Inquiry",
  acquisition: "Acquisition Inquiry",
};

export function InquiryForm({ type, title }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inquiry_type: type, website: "", nda_acknowledged: false },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await api.inquiries.submit(data as unknown as Record<string, string>);
      setStatus("success");
      setMessage(res.message);
      reset({ inquiry_type: type });
    } catch {
      setStatus("error");
      setMessage("Submission failed. Please try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{TYPE_LABELS[type]}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <input type="hidden" {...register("inquiry_type")} />
        <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${type}-name`}>Full Name</Label>
            <Input id={`${type}-name`} {...register("name")} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-email`}>Work Email</Label>
            <Input id={`${type}-email`} type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${type}-company`}>Company</Label>
            <Input id={`${type}-company`} {...register("company")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-role`}>Role</Label>
            <Input id={`${type}-role`} {...register("role")} />
          </div>
        </div>

        {(type === "licensing" || type === "acquisition") && (
          <div className="space-y-2">
            <Label htmlFor={`${type}-budget`}>Budget Range (optional)</Label>
            <Input id={`${type}-budget`} placeholder="e.g. $100K - $500K" {...register("budget_range")} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`${type}-message`}>Message</Label>
          <Textarea id={`${type}-message`} rows={4} {...register("message")} />
          {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
        </div>

        {type === "acquisition" && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register("nda_acknowledged")} className="mt-1" />
            <span>I acknowledge confidential acquisition NDA terms.</span>
          </label>
        )}

        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Inquiry"}
        </Button>

        {status === "success" && <p className="text-sm text-green-400">{message}</p>}
        {status === "error" && <p className="text-sm text-red-400">{message}</p>}
      </form>
    </div>
  );
}
