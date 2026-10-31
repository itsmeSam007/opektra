import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website terms",
  description: "Terms for Opektra’s public company website, software information and business enquiries.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <article className="op-legal">
      <p className="op-eyebrow">Opektra · Website terms</p>
      <h1>Website terms</h1>
      <p>Last updated: <time dateTime="2026-10-31">31 October 2026</time></p>

      <h2>1. About Opektra and this website</h2>
      <p>
        Opektra is the brand of Opektra Technologies Pvt Ltd, a software business
        based in Kolkata, West Bengal, India. The owner is Soumen Karmakar.
        These terms concern the public company pages at www.opektra.com and
        enquiries about our work. Contact us at{" "}
        <a href="mailto:admin@opektra.com">admin@opektra.com</a>.
      </p>

      <h2>2. Information and product demonstrations</h2>
      <p>
        This website describes our capabilities, approach and products. Articles
        provide general information rather than advice for your particular
        circumstances. Product scenes and sample workflows are illustrative;
        they are not live customer records or promises of a particular feature,
        release date, business result or service level. Check the relevant
        product website and an agreed specification for current availability.
      </p>

      <h2>3. Software projects and commercial terms</h2>
      <p>
        Sending an enquiry does not place an order or commit either party to a
        project. These public pages do not take payments or sell subscriptions.
        A paid engagement requires a separately accepted proposal, order or
        service agreement between the identified contracting parties.
      </p>
      <p>
        The agreement should specify scope, deliverables, acceptance criteria,
        timeline, fees and applicable taxes, payment milestones, change requests,
        support, cancellation and refund arrangements. Ownership or licensing of
        deliverables, source-code access and third-party services must also be
        agreed. Product subscriptions, including Conektra, have their own terms.
        These website terms do not replace a separately agreed contract or
        mandatory legal rights.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        Website materials belong to Opektra or their respective rights holders.
        You may browse and share links when evaluating our work. Reproducing or
        commercially distributing original content, or using our brand to imply
        endorsement, requires permission except where law or an applicable
        licence permits it. Third-party and open-source materials retain their
        own notices and licences. Visiting this site does not transfer software,
        source-code or trademark rights.
      </p>

      <h2>5. Responsible use and confidential information</h2>
      <p>
        Do not use this website for unlawful activity, impersonation, malicious
        code, unsolicited bulk messages or unauthorised access to systems or
        personal information. Do not disrupt availability or infringe others’
        rights. Report security concerns to our contact email without accessing
        or disclosing other people’s data.
      </p>
      <p>
        Share only information you are entitled to provide. For initial enquiries,
        avoid passwords, sensitive personal data and confidential source code.
        Agree an appropriate confidentiality arrangement and transfer method
        before providing confidential project materials. Our{" "}
        <Link href="/legal/privacy">Privacy notice</Link> explains information handling.
      </p>

      <h2>6. External websites and availability</h2>
      <p>
        Product and reference links may lead to sites with their own terms and
        privacy notices. Review them before providing information or buying a
        service. A link alone is not a guarantee of the linked site’s content
        or practices.
      </p>
      <p>
        We aim to keep information accurate and the website available, but
        information may change and access may be interrupted for maintenance or
        technical problems. This public website offers no contractual uptime or
        support commitment. Please report material errors for review.
      </p>

      <h2>7. Responsibility and statutory rights</h2>
      <p>
        Responsibility for loss is determined by applicable law and any relevant
        service agreement. Nothing here excludes liability that cannot lawfully
        be excluded, excuses fraud or wilful misconduct, or removes applicable
        consumer rights and remedies. Project refunds, warranties and ownership
        are governed by the relevant agreement, subject to mandatory law.
      </p>

      <h2>8. Indian law and resolving concerns</h2>
      <p>
        Indian law governs these website terms, subject to any mandatory
        protections that apply to you. Please write to{" "}
        <a href="mailto:admin@opektra.com">admin@opektra.com</a> with the relevant
        page and details of your concern. You retain the right to approach a
        competent court, consumer commission or other authority as permitted
        by law.
      </p>

      <h2>9. Updates and contact</h2>
      <p>
        Revisions will be published with an updated date and apply prospectively.
        They do not rewrite a separately agreed contract. A website visit is
        not consent to unrelated marketing or personal-data processing. For
        questions about these terms, <Link href="/contact">contact Opektra</Link>.
      </p>
    </article>
  );
}
