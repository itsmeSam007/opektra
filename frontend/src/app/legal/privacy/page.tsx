import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Opektra handles public website and enquiry information, and how to make a privacy request.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="op-legal">
      <p className="op-eyebrow">Opektra · Privacy notice</p>
      <h1>Privacy notice</h1>
      <p>Last updated: <time dateTime="2026-10-31">31 October 2026</time></p>

      <h2>1. Who we are and what this notice covers</h2>
      <p>
        Opektra is the brand of Opektra Technologies Pvt Ltd, based in Kolkata,
        West Bengal, India. The owner is Soumen Karmakar. This notice covers the
        public company pages at www.opektra.com and related business enquiries.
        Contact us at <a href="mailto:admin@opektra.com">admin@opektra.com</a>.
      </p>
      <p>
        These public pages do not provide visitor accounts, a contact submission
        form or a checkout. Product services, including Conektra, publish their
        own privacy information. Data processed for a customer’s project may
        also be governed by a separate service or data-processing agreement.
      </p>

      <h2>2. Information we receive and why</h2>
      <p>
        If you contact us, we receive what you choose to include: your name,
        email, organisation, contact details, message, attachments and subsequent
        correspondence. We use it to answer your request, prepare a proposal if
        requested, manage the business conversation and maintain necessary
        records. You can browse without sending an enquiry. Please avoid
        unnecessary sensitive information, passwords, payment credentials,
        government identity documents or confidential third-party data.
      </p>
      <p>
        Website delivery and security can involve IP addresses, browser or device
        details, requested pages, request times and error or security records.
        Hosting and network providers may process this information to deliver,
        troubleshoot and protect the site and meet applicable legal obligations.
        An enquiry does not automatically subscribe you to unrelated marketing.
        We will explain a new purpose and obtain consent where law requires it.
      </p>

      <h2>3. Email links, storage and tracking</h2>
      <p>
        Contact buttons open your email application with an optional draft.
        Information reaches us when you send the email; your email provider’s
        own practices also apply. The copy-email button writes our address to
        your clipboard when selected and does not read its contents.
      </p>
      <p>
        The public company pages do not include advertising trackers or audience
        analytics scripts. The presentation system may read a locally stored
        display preference. Browser settings let you clear site storage and
        manage cookies. Infrastructure providers may keep operational records;
        the absence of advertising scripts does not eliminate technical processing.
      </p>

      <h2>4. Access, providers and disclosures</h2>
      <p>
        People handling your enquiry and providers supporting email, hosting
        and website operations may access information needed for those purposes.
        Information may also be disclosed where required by law or a lawful
        authority request, or to establish or defend legal rights. Enquiry
        messages are not published as website content.
      </p>
      <p>
        Provider processing locations depend on the services involved. We do not
        represent that all information stays in India. Any transfer must meet
        applicable Indian legal requirements and agreed customer restrictions.
        External product and reference websites have their own privacy notices;
        review them before sharing information there.
      </p>

      <h2>5. Retention and security</h2>
      <p>
        Information is retained while needed for the enquiry or business purpose
        and for applicable legal, accounting, security or dispute requirements.
        Correspondence, technical logs and contractual records may have different
        retention requirements. When information is no longer needed and no
        retention obligation applies, we will delete or anonymise it, allowing
        for applicable provider backup cycles. You can contact us about the
        information and retention relevant to your enquiry.
      </p>
      <p>
        We are responsible for reasonable safeguards appropriate to the
        information and applicable law. No website or email transmission is
        completely secure. This notice does not claim a particular security
        certification. Report suspected exposure or misuse to our contact email,
        including only information necessary to explain the concern.
      </p>

      <h2>6. Requests, choices and privacy complaints</h2>
      <p id="privacy-contact">
        Privacy grievance contact: Soumen Karmakar, Opektra Technologies Pvt Ltd,
        Kolkata, West Bengal, India. Email:{" "}
        <a href="mailto:admin@opektra.com?subject=Privacy%20grievance">admin@opektra.com</a>.
        We will address privacy grievances expeditiously and within one month
        of receipt, or within a shorter period if applicable law requires it.
      </p>
      <p>
        You can ask about information you supplied, request access or correction,
        ask for deletion, or withdraw consent for future use where processing
        relies on consent. Email{" "}
        <a href="mailto:admin@opektra.com?subject=Privacy%20request">admin@opektra.com</a>{" "}
        with the subject “Privacy request” or “Privacy grievance”, describe the
        issue and provide enough context to locate the conversation. We may
        need proportionate verification of your identity or authority. Do not
        send identity documents unless an appropriate method has been agreed.
      </p>
      <p>
        We will handle requests under the rights, exceptions and time limits
        applicable under Indian law. Withdrawal does not undo lawful earlier
        processing. Records may need to be retained for legal obligations or a
        dispute; if a request cannot be fully met, we will explain why. You
        retain any right to seek a remedy from a competent authority.
      </p>

      <h2>7. Children’s information</h2>
      <p>
        This business-information website is not designed to collect personal
        information from children under 18. A parent or lawful guardian who
        believes a child has sent unnecessary personal information can contact
        us for review and appropriate deletion, subject to applicable law.
      </p>

      <h2>8. Updates and related information</h2>
      <p>
        Changes will be published here with an updated date. A revised notice
        does not itself provide consent for a new purpose. Read the{" "}
        <Link href="/legal/terms">Website terms</Link> for website-use information.
        For other business questions, <Link href="/contact">contact Opektra</Link>.
      </p>
    </article>
  );
}
