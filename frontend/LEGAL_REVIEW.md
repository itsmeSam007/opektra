# Public website legal content review

Reviewed 31 October 2026. Scope: Opektra’s public company website, its Terms and Privacy notice, and shared company/copyright disclosures. This is a source-based content review, not a certification of legal or operational compliance.

## Confirmed facts and scope

- User supplied the legal name **Opektra Technologies Pvt Ltd**, owner **Soumen Karmakar**, and city **Kolkata**. The legal registration itself has not been independently verified.
- User expressly approved Soumen Karmakar as privacy grievance contact, using **admin@opektra.com**, and requested company copyright with all rights reserved.
- The current public layout has no visitor signup, checkout, enquiry submission endpoint, advertising tracker or audience analytics script. Contact controls construct email drafts; the visitor chooses whether to send. Clipboard interaction only writes the public email address on click.
- `next-themes` can read a local display preference. Do not equate no advertising scripts with no local storage or no infrastructure logging.
- Legacy admin/backend source is retained separately. The public notice does not claim that all software in this repository is an account-free, data-free service.
- Conektra and customer projects require their own applicable product/service terms and processing notices.

## Sources and drafting decisions

1. [MeitY: DPDP Act commencement, G.S.R. 843(E), 13 November 2025](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf). Core processing obligations and section 44(2) are deferred for eighteen months from Gazette publication. At the review date, do not describe every DPDP provision as already operational or assert full compliance.
2. [MeitY: Digital Personal Data Protection Rules, 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf). Rule 1 has staggered commencement. Rights/request language is qualified by applicable law; no unverified DPO, Board remedy currently available, consent manager or blanket India-only hosting claim is published. Reassess before the operational provisions commence.
3. [Rajya Sabha: government answer on privacy grievances, 17 September 2020, printed page 123 / PDF page 127](https://cms.rajyasabha.nic.in/UploadedFiles/Debates/OfficialDebatesDatewise/Floor/252/F17.09.2020.pdf). This explains SPDI Rules 2011 rule 5(9), designation/publication of grievance contact and redress within one month. The public notice names the user-approved person and commits to that period (or a shorter applicable requirement); it does not incorrectly borrow intermediary-platform deadlines.
4. [MCA: Companies (Incorporation) Third Amendment Rules, 2016, rule 26](https://www.mca.gov.in/Ministry/pdf/CompaniesThridAmendementRules_28072016.pdf). Company websites must publish legal identity/contact disclosures on the landing/home page. The shared footer now carries the supplied legal name and named query contact. Remaining identity fields are an explicit outstanding item below.
5. [Delhi State Consumer Commission: Consumer Protection Act, 2019, including sections 2(7), 2(46), 2(47)](https://scdrc.delhi.gov.in/scdrc/new-consumer-protection-act-2019). Terms preserve applicable consumer/statutory remedies. They do not invent blanket no-refund conditions, a nominal liability cap, compulsory arbitration or an exclusive court location.
6. [India Code: Indian Contract Act, 1872](https://www.indiacode.nic.in/bitstream/123456789/2187/2/A187209.pdf). Service scope/commercial terms belong in a separately accepted agreement; enquiry or casual browsing is not treated as placing an order or providing unrelated data-processing consent.

## Outstanding operator information and implementation obligations

- **Company disclosure remains incomplete:** the user deferred the full registered office address. CIN and telephone number have not been supplied either. Obtain and verify these and publish the applicable rule 26 details on the homepage/shared footer. Kolkata is a city, not a substitute for a registered office address. No fictional street, PIN, CIN or phone was added.
- Verify legal entity spelling/registration and authority to trade under the supplied name. Do not infer a director designation from “owner”.
- Confirm actual hosting/CDN/email providers, processing locations, access controls, security procedures, data categories and retention schedules. The source code cannot verify provider configurations or mailbox handling. Update the notice when those facts change; operate the commitments it makes.
- Monitor the grievance mailbox, track receipt dates, verify identity proportionately, and meet the published grievance period. The page itself does not implement a ticketing or deletion service.
- Maintain reasonable security safeguards, purpose limits, necessary provider contracts and deletion/backup procedures. Follow any applicable legal log/record retention; this review does not authorise deleting legally required records.
- Before adding analytics, forms, accounts, payment collection or a new processing purpose, reassess notice/consent and applicable product, consumer, tax and data-protection obligations. Reassess the DPDP commencement position before launch and as phased provisions begin.

## Validation

See the fresh run in root `design-qa.md` and `output/responsive-qa/2026-10-31-legal/` for the final browser evidence and build/check results. Source links above support the legal review; they do not establish that the operator’s infrastructure or company filings meet those rules.
