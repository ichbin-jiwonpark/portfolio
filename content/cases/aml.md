---
title: Building a payment company's first AML system, from regulation to the screens staff use every day
card_title: First AML system
kind: Work
year: 2023–2024
image: images/aml/cover.jpg
summary_product: Turning a new legal duty into one working process: merchant due diligence, sanctions screening and transaction monitoring, live within the deadline.
summary_design: Designing the step-by-step customer due diligence flow for a payment company's first AML system, with the checks, locks and permissions that compliance requires.
role: Project lead and main point of contact: requirements, vendor research, screen and flow design, internal regulation, manual
team: Engineering, compliance and legal, HR, finance, information security, ERP, an external AML solution vendor
timeline: Feb 2023 – Feb 2024 · system live Nov 2023
platform: Internal back-office (web)
users: Sales-support staff who register and verify business customers
note: Screens and diagrams are redrawn for this portfolio with fictional data, following the structure, fields and rules of the implemented system. Company materials are not reproduced.
outcome: System live in November 2023; the company met its AML obligations within the deadline
result: 1,000+ merchants in one auditable process, on time
tldr_problem: New AML duties for payment companies. Merchant checks were manual, spread across teams and left little evidence.
tldr_role: Project lead and single point of contact for seven internal teams and the vendor. I designed the due diligence flow and screens.
tldr_impact: Live in November 2023, within the deadline. 1,000+ merchants, including franchise businesses, verified in one auditable process. Revised rules approved by the board in February 2024.
line_design: A step-by-step due diligence flow where every check, lock and branch follows the law
line_product: Led a payment company's first AML system, from the law and vendor choice to launch
title_product: A payment company's first AML system, from regulation to launch
stats_product: 1,000+ :: merchants verified through one auditable process || 7 teams :: and a vendor, with me as the single point of contact || Nov 2023 :: live, within the legal deadline
skills_product: KYB / merchant due diligence (CDD, EDD) · Sanctions & PEP screening · Transaction monitoring · Regulation into requirements · Vendor selection · Stakeholder management
---

## The problem

A change in Korean regulation made payment companies responsible for anti-money-laundering duties: knowing their business customers, assessing their risk, screening them against sanctions lists and reporting suspicious transactions. For a payment gateway, the customer is the merchant.

We had no system for this. The work was manual, spread across departments, and treated as unclear and low-priority.

| Area | Before | With the system |
|---|---|---|
| Merchant due diligence | Documents checked by eye | Checked in the back office, risk-scored by the AML solution, evidence kept |
| Ongoing checks | None after onboarding | Every 3 years, every year if high risk, and when key details change |
| Transaction monitoring | Rules never revised; alerts in a chat messenger | Rules across transactions and settlement in the AML solution |
| Suspicious transaction reports | Typed by hand on the reporting website | Filed from templates in the solution |
| Internal rules | Unchanged since 2019 | Revised |

![Onboarding a new business customer, before and with the AML system](images/aml/onboarding.svg)

*A merchant ID is now issued only after the risk result comes back low risk and approved.*

## My role

I made the case for one project, then learned the regulation before writing a single requirement. From there I was the single point of contact for compliance and legal, HR, finance, information security, the ERP team, engineering and the vendor.

## Key decisions

- **Vendor:** the solution other payment gateways already used, chosen from a shortlist of three to five. A proven setup mattered more than features on paper.
- **Duplicate check before a new record:** staff cannot overwrite a verified merchant, so re-verification dates stay intact.
- **Lock after confirmation:** due diligence must be complete before service starts, even at the cost of extra steps.
- **Threshold exceptions after launch:** for merchants with many small payments, fewer false alerts in exchange for some sensitivity.

## What I built

- **Risk rules with the vendor:** customer risk assessment, sanctions and PEP screening, and transaction monitoring. I analysed our transaction data and merchant profiles to set the thresholds.
- **One data model:** code values for every field, so the back office and the AML solution speak the same language.
- **Fields that trace back to the law:** every registration field maps to an identification item the regulation requires.
- **A five-step due diligence flow:** business, representative, beneficial owner, agent, confirm. One flow for companies and sole traders, with re-verification and enhanced checks for high-risk customers.

![The customer due diligence flow, from duplicate check to risk result](images/aml/cdd-flow.svg)

The back-office screens were built almost exactly as I designed them.

![Customer due diligence list with filters for service, risk result and re-verification date](images/aml/screen-list.jpg)

*Every business customer with its risk result, watch-list and EDD flags, and re-verification date.*

![Risk assessment result for a confirmed record: on hold, high risk, enhanced due diligence required](images/aml/screen-result.jpg)

*After Confirm, the record locks until the risk result arrives. A high-risk customer goes on hold for enhanced due diligence.*

## Result

- **On time:** live in November 2023, and the company met its AML obligations within the deadline
- **Auditable:** 1,000+ merchants, including franchise businesses, verified through one documented process. Every review, including a decision that a transaction is normal, is recorded
- **Governed:** I revised the internal rules and wrote the registration manual; the board approved the revised rules in February 2024
- **Tuned:** after launch, I adjusted thresholds that were set too low with the vendor, and added exceptions with engineering to cut false alerts

## What I'd do differently

As a first version, parts of it still feel complex for operators. With more time, I would cut more of the manual work AML operators still do, without touching live payment data.
