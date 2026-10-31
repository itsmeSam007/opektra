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
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  inquiry_type: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  defaultType?: string;
  submitLabel?: string;
}

export function ContactForm({ defaultType = "general", submitLabel = "Send Message" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inquiry_type: defaultType, website: "" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await api.contact.submit(data as unknown as Record<string, string>);
      setStatus("success");
      setMessage(res.message);
      reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate data-testid="contact-form">
      <input type="hidden" {...register("inquiry_type")} />
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} data-testid="contact-name" />
          {errors.name && <p className="text-xs text-red-400" role="alert">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} data-testid="contact-email" />
          {errors.email && <p className="text-xs text-red-400" role="alert">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register("company")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register("message")} aria-invalid={!!errors.message} data-testid="contact-message" />
        {errors.message && <p className="text-xs text-red-400" role="alert">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto" data-testid="contact-submit">
        {status === "loading" ? "Sending..." : submitLabel}
      </Button>

      {status === "success" && (
        <p className="text-sm text-green-400" role="status" data-testid="contact-success">{message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">{message}</p>
      )}
    </form>
  );
}
