import Script from "next/script";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

export function StructuredData() {
  return <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />;
}
