---
title: Adding a second processing route for live card payments, without stopping the service
card_title: Payment redundancy
kind: Work
year: 2021
summary_product: Adding a second processing route for live card payments, from partner tender and service policy to a phased launch and post-launch fixes.
summary_design: Defining how a new card-payment route works for merchants, operations and finance, and fixing what customers saw on their statements after launch.
role: Product Owner (lead): partner selection, service policy, schedule, launch, issue response
team: Engineering, two back-office planning colleagues (screen specifications), legal and procurement, external payment partners
timeline: First discussed 2019 · active from 2020 · launched April 2021
platform: Payment gateway and back-office
scope: Credit card payments of one merchant group, rolled out service by service
---

## Background

The company processed card payments for its merchants through a single card-processing route. To make payments more resilient, it added a second route: credit card payments processed through an external payment partner (a "PG-to-PG" or sub-PG setup). The goal was payment stability through redundancy, so payments no longer depended on one route.

This meant changing how live payments were approved, cancelled, settled and reported, for merchants whose customers were paying every day.

## Choosing the partner

I invited both existing and new partners and ran the selection as a formal tender under company rules, with legal and procurement involved.

## Defining how the service works

I wrote the service policy that engineering and operations built against. It answered the questions a new payment route raises:

- **Onboarding:** merchants are registered through partner merchant IDs instead of a separate review by each card company
- **Money flow:** settlement cycle, full and partial cancellation before and after card-company capture, monthly tax invoices
- **Card rules:** instalment limits, card-issuer interest-free campaigns, and which cards are supported. Overseas cards were excluded because the required authentication was not available on this route
- **Data mapping:** how our merchant and terminal data maps to the partner's IDs, including exception cases such as employee discounts, so no payment falls through

Two colleagues drew the back-office screens so that operations and finance could tell the new route apart in transaction search, statistics and settlement reconciliation. They confirmed every requirement with me; where there were options, I decided the direction, and I reviewed each screen with engineering for its impact on day-to-day operations.

## Testing and phased launch

With engineering and the partner, I tested authorisation and cancellation. Settlement could not be tested before launch, so it was monitored closely after go-live.

Instead of switching everything at once, the launch started with one merchant group and moved through its services one by one, starting with recurring and manual card payments.

## After launch

The launch surfaced issues the tests could not, and I checked incoming customer inquiries as they arrived, traced each case and coordinated fixes with engineering and the partner.

- **A different name on card statements.** Existing customers saw an unfamiliar merchant name and asked what the charge was. The name is set by each card company's own rules, so it could not simply be changed. I ran approval and cancellation tests across all card companies, documented exactly how the name appeared in SMS, app push notifications and on the actual statement for each one, and gave this reference to the merchant. We agreed this would be the standard, so their customer service could answer with certainty.
- **Missing card-issuer benefits.** Some card-issuer benefits did not apply on the new route; each case was traced and handled with the partner.

Once the issues settled, the route ran as part of normal operations.

## Reflection

If I did this again, I would make the reference-data check more systematic and give it more room in the schedule. Beyond the planned tests, I would confirm with real approvals and cancellations that the data lands correctly in both our payment system and the partner's, and settle the wording customers see on statements and notifications in advance, so that as many cases as possible are caught during development and operations testing, not after launch.
