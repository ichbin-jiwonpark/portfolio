---
title: Building a payment company's first AML system, from regulation to the screens staff use every day
card_title: First AML system
kind: Work
year: 2023–2024
image: images/aml/cover.jpg
summary_product: Leading a payment company's first anti-money-laundering system, from learning the regulation and researching vendors to tuning monitoring rules against real transaction data.
summary_design: Designing the step-by-step customer due diligence flow for a payment company's first AML system, with the checks, locks and permissions that compliance requires.
role: Project lead and main point of contact: requirements, vendor research, screen and flow design, internal regulation, manual
team: Engineering, compliance and legal, HR, finance, information security, ERP, an external AML solution vendor
timeline: Feb 2023 – Feb 2024 · system live Nov 2023
platform: Internal back-office (web)
users: Sales-support staff who register and verify business customers
note: Screens and diagrams are redrawn for this portfolio with fictional data, following the structure, fields and rules of the implemented system. Company materials are not reproduced.
outcome: System live in November 2023; the company met its AML obligations within the deadline
result: 1,000+ merchants in one auditable process, on time
tldr_problem: A new legal AML duty for electronic financial companies. Customer checks were manual, spread across teams, and left little evidence.
tldr_role: Project lead and single point of contact for seven internal teams and the vendor. I designed the customer due diligence flow and screens.
tldr_impact: System live in November 2023, and AML obligations met within the deadline. More than 1,000 merchants, including franchise businesses, were verified through one documented, auditable process, and the revised rules were approved by the board in February 2024.
line_design: A step-by-step due diligence flow where every check, lock and branch follows the law
line_product: Led a payment company's first AML system, from the law and vendor choice to launch
---

## Background

A change in Korean regulation made licensed electronic payment companies, including ours, responsible for anti-money-laundering duties: knowing who their business customers are, assessing their risk, screening them against sanctions lists, monitoring transactions, and reporting suspicious ones.

For a payment gateway, the customer is the merchant: the business that signs the contract, whether a sole proprietor or a company. The company had no AML system for them. The project existed to meet this obligation on top of a payment service that was already running every day.

## The problem

Before the project, AML-related work was spread across departments and done by hand. Customer documents were checked by eye. Each check needed a separate data request to engineering. Suspicious-transaction monitoring ran as monitor, handle internally, close, with little left on record. The internal rules for electronic financial business had not been revised since they were first written in 2019.

In the operating manual I later wrote, I mapped the main AML duties and the process around them from how they were done before to how they run with the system. These checks were legal duties, so I turned them into requirements and set up the process and documents to meet the legal standard, reviewing them with the vendor and engineering:

| Area | Before | With the system |
|---|---|---|
| Customer due diligence | Merchant documents collected and checked by eye | Verification in the back office, risk-assessed by the AML solution, with evidence kept for every check |
| Due diligence form | One template for companies and sole proprietors; merchants were unsure what to fill in | Separate, updated forms for companies and sole proprietors |
| Document check | No step to verify what the form said | Sales support checks first, then the sales rep reviews the documents and adds a comment |
| Legal review | The service contract only | The due diligence form and documents attached to the review |
| Ongoing due diligence | None after the first documents were filed | New merchants at contract; existing merchants every 3 years, or every year if high risk, and whenever key details change |
| Transaction monitoring | Rules unchanged since they were first set; alerts arrived in a chat messenger | Monitoring rules across transactions and settlement in the AML solution |
| Suspicious transaction reports | Written by hand on the reporting website | Filed from report templates in the solution |
| Internal rules | Not revised since 2019 | Revised |

For onboarding, I drew the process maps myself, after confirming the requirements with engineering and the other teams involved. Before the system, a new merchant's documents went to a finance-team review and the merchant was then set up by hand. With the system, customer due diligence sits in that place, and a merchant ID is issued only after the risk result comes back low risk and approved.

![Onboarding a new business customer, before and with the AML system](images/aml/onboarding.svg)

*Redrawn from my process maps in the operating manual.*

Because the work was scattered, it had been treated as unclear and low-priority. My first job was to make the case for it and turn it into one project.

I started without knowing the legal details, so I learned the regulation and its requirements first. I then collected requirements from every department involved and became the single point where questions, requirements and confirmation requests came together: from compliance and legal, HR, finance, information security, the ERP team, engineering and the vendor.

## Key decisions

- **Vendor:** chose the solution other payment gateways already used over the rest of a shortlist of three to five, because a proven PG setup mattered more than features on paper.
- **Duplicate check before a new record,** instead of letting staff overwrite one: re-verification dates stay intact, at the cost of one more step before registration.
- **Lock after confirmation:** due diligence must be complete before service starts, which means extra steps for staff.
- **Threshold exceptions after launch:** for merchants with many small payments, I had exceptions applied instead of keeping one rule for all, trading some alert sensitivity for fewer false alerts that operators had to clear.

## Building the system

**Risk rules.** Together with the vendor, I set up the three core checks:

- **Customer risk assessment:** built from the regulatory requirements combined with the vendor's input
- **Sanctions and PEP screening:** against the international lists provided in the vendor's solution; a match during customer verification leads to rejection
- **Transaction monitoring:** rules based on the vendor's practice and international standards. I analysed our actual transaction data and merchant profiles to give input on the thresholds.

**Field values.** With engineering and the vendor, I defined the code values behind every selectable field, from company type and listing market to the source of funds and the agent's relationship to the representative, so the back office and the AML solution use the same values.

**From regulation to fields.** Every section of the registration traces back to the identification items the AML regulation requires:

| What the regulation requires | Where it lives |
|---|---|
| Identity of the business: name, business and company numbers, head office and business addresses, industry, purpose of a non-profit | Business details section |
| Identity of the representative and any agent: name, date of birth, nationality, address, occupation | Representative and agent sections |
| Beneficial owners: name, nationality, share | Beneficial owner pop-up |
| Extra checks for high-risk customers: purpose of transactions, source of funds, company size, listing, founding date, website | Fields in the business details, used for enhanced due diligence |
| Watch-list screening: financial sanctions lists, UN sanctions, high-risk countries, foreign politically exposed persons | Run by the AML solution, shown in the risk result |

**The customer due diligence flow.** I designed every registration screen and branch of the flow in PowerPoint and shared the specifications with engineering. Registration runs in five steps: business details, representative, beneficial owner, agent, and confirm. The same flow covers companies and sole proprietors, with small differences in each step.

Beyond the key decisions above, the other rules in the flow:

- **The business registration number is checked on entry.** It is the key the back office shares with the AML solution, so a number in the wrong format raises an alert and has to be checked again before the record can go on.
- **The beneficial-owner step can be skipped where the law allows it.** Companies that file public business reports and financial institutions are exempt; for a sole proprietor, the step closes when the owner is the representative. Everyone else must list each owner with their share.
- **One business, many merchant IDs.** The business registration number is the key the back office shares with the AML solution. When a business runs several merchant IDs, each is added as an agent under the same record, so the business is verified once.
- **Re-verification** every three years, or every year for high-risk customers, and whenever key details change: for a company, its name, number, nationality or representative; for a sole proprietor, the name, number or nationality. Existing merchants are covered from contracts signed in July 2019, when the duty began, as set in the revised internal rules, and older merchants when needed.
- **High-risk customers get enhanced due diligence** (purpose of transactions, source of funds) before a decision.
- **Three outcomes** from the risk result: approved for transactions, on hold while approval is pending, or rejected. A high-risk or watch-list result means the verification is done again.

![The customer due diligence flow, from duplicate check to risk result](images/aml/cdd-flow.svg)

Behind the registration screens, the due diligence itself runs as one flow, for new merchants and for existing merchants whose business details change or whose contract is due for renewal.

![Inside customer due diligence: the check, risk assessment, enhanced review for high-risk customers, and the outcomes](images/aml/cdd-decisions.svg)

## What was built

The back-office screens were implemented almost exactly as designed.

![Customer due diligence list with filters for service, risk result and re-verification date](images/aml/screen-list.jpg)

*The list shows every business customer with its risk result, watch-list and EDD flags, and re-verification date. Records still waiting to be sent for assessment show a Confirm button.*

![Risk assessment result for a confirmed record: on hold, high risk, enhanced due diligence required](images/aml/screen-result.jpg)

*After Confirm, the record locks until the risk result arrives the next day. A high-risk customer is put on hold for enhanced due diligence and re-verified every year.*

## Launch and result

**Delivery.** I took part in the full data-integration and system-planning process with engineering, the ERP team and the vendor. The system went live in November 2023. Alongside it, I revised the company's internal rules for electronic financial business and wrote the registration manual (v2.0, October 2023) for the sales-support team, including as-is and to-be process maps. In February 2024, the completed project and the revised rules were reported to the board for approval.

**After launch.** Some monitoring rules had thresholds set too low. I met with the vendor to adjust them, and asked engineering to apply adjustments or exceptions for merchants with many small payments. Registering business customers and managing their verification records in the new system became part of my own daily work.

**Result.**

- The company met its AML obligations within the deadline, with its first AML system
- Work that had been scattered and manual became one documented process, with revised internal rules and a manual
- Every verification now leaves evidence in the system. Flagged transactions can be looked up, and each review, including a decision that a transaction is normal, is recorded
- Account permissions follow the reporting steps, so staff assess a flagged transaction and then send it for approval. The company can show that it meets its AML duties, not only say so

## Reflection

The vendor's system and our back office were connected, but as a first version the result can still feel complex. The existing back-office data was large and all of it mattered, so after assessing the impact on live services with engineering, we made some compromises. If I did it again, I would analyse further and, without affecting data or live services, cut more of the manual work AML operators still do.
