---
role: Project lead; designed the customer due diligence flow and every registration screen
---

## Background

A change in Korean regulation made licensed electronic payment companies, including ours, responsible for anti-money-laundering duties: knowing who their business customers are, assessing their risk and screening them against sanctions lists before they receive the service.

For a payment gateway, the customer is the merchant: the business that signs the contract, whether a sole proprietor or a company. The company had no system for this. Customer documents were collected and checked by eye.

## Users and constraints

**Who uses it.** The three sales-support staff who register business customers. They work from the documents a merchant submits: the business registration, ID copies, the shareholder register and the due diligence form.

**What the design had to respect.**

- **The law.** It sets what must be checked, and verification has to be complete before a customer receives the service.
- **A back office in daily use.** The new screens had to fit into a system staff already relied on for payments.
- **An external AML solution.** The back office sends each record to the vendor's solution for risk assessment and gets the result back the next day. Both systems need the same key and the same values.
- **Real merchant structures.** One business can run several merchant IDs, and three services (payment gateway, gift card and pay) each have their own staff and customers.

## Process

I drew the process maps myself, after confirming the requirements with engineering and the other teams involved. Before the system, a new merchant's documents went to a finance-team review and the merchant was then set up by hand. With the system, customer due diligence sits in that place, and nothing goes live until it is cleared.

![Onboarding a new business customer, before and with the AML system](images/aml/onboarding.svg)

*Redrawn from my process maps in the operating manual. A merchant ID is issued only after the risk result comes back low risk and approved.*

**Fixing the input first.** Two problems sat before any screen. The due diligence form was one template for companies and sole proprietors, so merchants were unsure what to fill in, and some fields came back empty. These checks were a legal duty, so I took them as requirements: I set up the process and the documents to meet the legal standard, reviewing them with the vendor and engineering. I split the form into a company and a sole-proprietor version, brought it up to date and added a box where the sales rep confirms the check. Registration now starts with a document check: sales support checks first, then the sales rep reviews the documents and adds a comment. The contract's legal review includes the due diligence form and documents too.

| Document | What is checked |
|---|---|
| Service contract and application | Details filled in and stamped; which payment options the merchant uses, such as escrow or payouts |
| Due diligence form | Required fields and beneficial-owner details complete |
| Business registration, settlement account | Copy is genuine; account holder matches the business name |
| Representative's ID | Matches the representative on the business registration |
| Company registry extract, company seal certificate (companies) | Original, issued within the last three months |
| Beneficial-owner evidence, such as the shareholder register | Matches what the form declares |
| Agent's application and ID (if there is an agent) | Matches the agent on the form |

Each document is marked either complete or on hold until the merchant sends what is missing.

The due diligence itself runs as one flow: for every new merchant at contract, and again for existing merchants every three years (every year if high risk) or when key details change, such as the business name, number or nationality, or a new representative.

![Inside customer due diligence: the check, risk assessment, enhanced review for high-risk customers, and the outcomes](images/aml/cdd-decisions.svg)

## Design decisions

I designed every registration screen and branch of the flow in PowerPoint and shared the specifications with engineering. Registration runs in five steps: business details, representative, beneficial owner, agent, and confirm. The same flow covers companies and sole proprietors, with small differences in each step.

![The customer due diligence flow, from duplicate check to risk result](images/aml/cdd-flow.svg)

Each rule in the flow has a reason.

**1. A duplicate check before anything else.** A business that is already registered does not need a new check until its re-verification date, and overwriting its record would break the re-verification schedule. So the first screen asks only for the service and the business number, and registration cannot continue until the check passes.

![New customer: the duplicate check must pass before registration continues](images/aml/screen-new.jpg)

*If the business already exists, the button stays disabled and the screen says what to do instead: add the new merchant ID as an agent.*

**2. One business, many merchant IDs.** The business registration number is the key the back office shares with the AML solution. When a business runs several merchant IDs, each is added as an agent under the same record, so the business is verified once.

**3. Fields that both systems understand.** With engineering and the vendor, I defined the code values behind every selectable field, from company type and listing market to the source of funds and the agent's relationship to the representative. Staff choose from fixed options instead of typing, and the back office and the AML solution read each answer the same way.

![Business details form with the source-of-funds options open](images/aml/screen-details.jpg)

*Business details, filled in from the merchant's documents. Fields that affect enhanced due diligence, such as a virtual-asset business, are marked on screen.*

Every section traces back to the identification items the AML regulation requires:

| What the regulation requires | Where it lives |
|---|---|
| Identity of the business: name, business and company numbers, head office and business addresses, industry, purpose of a non-profit | Business details section |
| Identity of the representative and any agent: name, date of birth, nationality, address, occupation | Representative and agent sections |
| Beneficial owners: name, nationality, share | Beneficial owner pop-up |
| Extra checks for high-risk customers: purpose of transactions, source of funds, company size, listing, founding date, website | Fields in the business details, used for enhanced due diligence |
| Watch-list screening: financial sanctions lists, UN sanctions, high-risk countries, foreign politically exposed persons | Run by the AML solution, shown in the risk result |

**4. Skip what the law allows, require the rest.** Companies that file public business reports and financial institutions are exempt from the beneficial-owner check; for a sole proprietor, the step closes when the owner is the representative. Everyone else must list each owner with their share and the supporting document.

![Representative, beneficial owner and agent sections, with the beneficial owner pop-up open](images/aml/screen-owner.jpg)

*The exemption is one choice at the top of the section. Owners are entered in a pop-up, one row per owner.*

**5. Lock the record once it is confirmed.** Verification must be complete before the service starts, so the record that was assessed cannot change in between. Until Confirm, everything can be edited. After it, the record locks until the risk result arrives the next day.

![Risk assessment result for a confirmed record: on hold, high risk, enhanced due diligence required](images/aml/screen-result.jpg)

*The result tab shows the outcome, the customer's risk level, whether enhanced due diligence is needed and when re-verification is due.*

**6. Three outcomes, each with a next step.** Approved for transactions, on hold while approval is pending, or rejected. A high-risk customer gets enhanced due diligence (purpose of transactions, source of funds) before a decision and is re-verified every year instead of every three. A high-risk or watch-list result means the verification is done again.

**7. Status at a glance, separated by service.** The list shows every customer with its risk result, watch-list and enhanced due diligence flags and re-verification date, and records waiting to be sent show a Confirm button. Each service's staff see only their own customers.

![Customer due diligence list with filters for service, risk result and re-verification date](images/aml/screen-list.jpg)

## Outcome

- The back-office screens were implemented almost exactly as designed, and the system went live in November 2023
- I wrote the registration manual (v2.0, October 2023) for the sales-support team, with the process maps and a step-by-step guide to every screen
- The company met its AML obligations within the deadline, and every verification now leaves evidence in the system
- Registering business customers and managing their verification records in the new system became part of my own daily work

## Reflection

The vendor's system and our back office were connected, but as a first version the result can still feel complex. The existing back-office data was large and all of it mattered, so after assessing the impact on live services with engineering, we made some compromises. If I did it again, I would analyse further and, without affecting data or live services, cut more of the manual work AML operators still do.
