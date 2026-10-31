import { Container, Section } from "@/components/layout/section";
import { getServerApiUrl } from "@/lib/api-base";

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let message = "Missing confirmation token.";
  let ok = false;

  if (token) {
    try {
      const res = await fetch(`${getServerApiUrl()}/newsletter/confirm?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      ok = res.ok;
      message = data.message || data.detail || "Confirmation failed.";
    } catch {
      message = "Unable to confirm subscription. Please try again later.";
    }
  }

  return (
    <Section>
      <Container className="max-w-lg text-center">
        <h1 className="text-2xl font-bold">{ok ? "Subscription Confirmed" : "Confirmation Failed"}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </Container>
    </Section>
  );
}
