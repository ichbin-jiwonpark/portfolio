---
role: Project lead; designed the customer due diligence flow and every registration screen
title_design: Designing the due diligence flow for a payment company's first AML system
summary_design: A step-by-step back-office flow where every check, lock and branch follows the law, built almost exactly as designed.
stats_design: 5 steps :: one registration flow for companies and sole traders || 1,000+ :: merchants verified through it || Nov 2023 :: live, within the legal deadline
skills_design: Complex form flows · Regulation into UI · B2B back-office UX · Process mapping · Design specs for engineering · Shared data model
tldr_problem_design: New AML rules required every merchant to be verified before service. Documents were checked by eye, with no system and little evidence.
tldr_role_design: Project lead. I designed the due diligence flow and every registration screen, and specified them for engineering.
tldr_impact_design: Built almost exactly as designed and live in November 2023, within the deadline. 1,000+ merchants verified through one auditable flow.
---

## The problem

New Korean regulation made payment companies responsible for knowing their business customers, assessing their risk and screening them against sanctions lists before they receive the service. For a payment gateway, the customer is the merchant.

There was no system. Merchant documents were collected and checked by eye.

## Users and constraints

**Users:** three sales-support staff who register business customers from the documents a merchant submits.

- **The law** sets what must be checked, and verification must be complete before service starts
- **A back office in daily use:** the new screens had to fit a system staff relied on for payments
- **An external AML solution** assesses each record overnight, so both systems need the same key and values
- **Real merchant structures:** one business can run several merchant IDs across three services

## Process

I drew the process maps myself. Customer due diligence now sits where a manual finance review used to be, and nothing goes live until it is cleared.

![Onboarding a new business customer, before and with the AML system](images/aml/onboarding.svg)

*A merchant ID is issued only after the risk result comes back low risk and approved.*

**Fixing the input first.** Merchants were unsure what to fill in on one shared form. I split it into a company and a sole-proprietor version, and added a document check before registration: sales support checks first, then the sales rep reviews and comments.

![Inside customer due diligence: the check, risk assessment, enhanced review for high-risk customers, and the outcomes](images/aml/cdd-decisions.svg)

## Design decisions

Registration runs in five steps: business details, representative, beneficial owner, agent and confirm. Each rule has a reason.

![The customer due diligence flow, from duplicate check to risk result](images/aml/cdd-flow.svg)

- **Duplicate check first:** overwriting a verified business would break its re-verification schedule, so registration cannot continue until the check passes.

![New customer: the duplicate check must pass before registration continues](images/aml/screen-new.jpg)

*If the business exists, the button stays disabled and the screen says what to do instead.*

- **One business, many merchant IDs:** each extra ID is added as an agent under the same record, so the business is verified once.
- **Fields both systems understand:** fixed options instead of free text, with code values defined with engineering and the vendor.

![Business details form with the source-of-funds options open](images/aml/screen-details.jpg)

*Fields that trigger enhanced due diligence are marked on screen.*

- **Skip only what the law allows:** exempt companies skip the beneficial-owner step with one choice; everyone else lists each owner and their share.

![Representative, beneficial owner and agent sections, with the beneficial owner pop-up open](images/aml/screen-owner.jpg)

- **Lock after confirmation:** the record that was assessed cannot change before the result arrives.

![Risk assessment result for a confirmed record: on hold, high risk, enhanced due diligence required](images/aml/screen-result.jpg)

*The result shows the outcome, risk level, enhanced due diligence and the next re-verification date.*

- **Status at a glance:** every customer with risk result, flags and re-verification date; each service sees only its own customers.

![Customer due diligence list with filters for service, risk result and re-verification date](images/aml/screen-list.jpg)

## Outcome

- **Built as designed:** the back-office screens were implemented almost exactly as specified, live in November 2023
- **On time:** the company met its AML obligations within the deadline, and every verification now leaves evidence
- **Documented:** I wrote the registration manual (v2.0) with the process maps and a guide to every screen
- **Used daily:** registering business customers in the new system became part of my own work

## Reflection

As a first version, the flow can still feel complex for operators. With more time, I would cut more of the manual work they still do, without touching live payment data.
