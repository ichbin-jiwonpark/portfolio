---
title: Payment redundancy for stable card payments: adding a second processing route without stopping the service
card_title: Payment redundancy
kind: Work
year: 2021
image: images/routing/cover.jpg
image_design: images/routing/cover-design.jpg
summary_product: Ending our dependence on a single gateway: an external partner added as a second route for card payments, from tender and policy to a phased launch.
summary_design: Working out what operations, sales support and finance needed to tell a second payment gateway apart, and turning their questions into back-office screens.
role: Product Owner (lead): partner selection, service policy, reference data, screen planning, testing, launch plan, issue response
team: Engineering, operations, sales, sales support, settlement, a back-office planning colleague (settlement screens), legal and procurement, an external payment partner
timeline: First discussed 2019 · active from 2020 · launched April 2021
platform: Payment gateway and back-office
scope: Credit card payments of one merchant group, rolled out service by service
note: Screens and diagrams are redrawn for this portfolio with fictional data, following my screen plans and the implemented system. Partner and merchant names are left out, and the settlement screens, designed by a colleague, are not shown.
outcome: Launched in April 2021, service by service; after the post-launch fixes the route ran as part of normal operations
result: Second route in daily use, splitting card payments with ours
tldr_problem: All card payments relied on a single gateway. A second route meant changing how live payments were approved, cancelled, settled and reported.
tldr_role: Product owner, from zero to launch: partner tender, service policy, reference data, screens (except settlement), tests, launch plan and issue handling.
tldr_impact: At launch, 100% of one merchant group's card payments moved to the new route without stopping the service. After the fixes, payments were split between both routes as planned.
line_design: Back-office screens that show which gateway processed each card payment
line_product: A second processing route for live card payments, from tender to phased launch
title_product: A second payment gateway, launched without stopping live payments
stats_product: 1 → 2 :: payment gateways, so card payments no longer rely on one || 40 :: policy questions settled with the partner before launch || 100% :: of one merchant group moved at launch, with the service running
skills_product: Multi-PSP redundancy · Partner tender · Payment policy (cancellation, settlement, instalments) · Reference data mapping · Phased rollout · Settlement reconciliation · Incident handling
---

## The problem

Our gateway reached the card companies through several VAN networks, but there was only one gateway. If it had a problem, card payments had a problem.

The goal: connect an external payment gateway as a second route for card payments ("PG-to-PG" in Korea), for merchants whose customers paid every day, without stopping the service.

![Our gateway already reached the card companies through several VANs; a partner gateway was added alongside as a backup](images/routing/routes.svg)

## My role

Product owner, from zero to launch. The partner tender, the service policy, the reference-data requirements, the back-office screens and the launch plan all started with me. A colleague designed the settlement screens.

## Key decisions

- **Service by service,** starting with recurring and manual card payments, instead of switching everything at once: less risk for live payments, at the cost of a longer rollout.
- **Settlement monitored live from day one,** because the setup could not be tested before launch, instead of delaying the launch.
- **Onboarding through partner merchant IDs,** instead of a separate review by each card company, so merchants could switch faster. To limit the dependency, I gave the partner our merchant numbers, asked for the same setup, and kept a copy on our side.

## Defining the service

- **Partner:** a formal tender under company rules, with legal and procurement, open to existing and new partners.
- **Policy:** 40 questions with the partner, each answer recorded: merchant IDs, settlement and payout cycles, full and partial cancellation, instalments and interest-free campaigns, receipts, fees and escalation contacts. Overseas cards were excluded, because the required authentication was not available on this route.
- **Data mapping:** our merchant and terminal IDs mapped to the partner's IDs, including exceptions such as employee discounts, so no payment falls through.
- **Screens:** I collected requirements from operations and finance, so the new route is visible in reference data, transaction search and statistics.

![Integration mapping: our terminal IDs mapped to the partner's merchant IDs and the card-company numbers it received](images/routing/screen-map.jpg)

*Each of our terminal IDs mapped to the partner's merchant ID and the card-company number.*

![Transaction search with a route filter and route and processing-code columns](images/routing/screen-tx.jpg)

*A route filter and new columns show at a glance which route processed a payment.*

## Launch

For the last three weeks, I turned the remaining work into a day-by-day plan with an owner for every step.

| When | What | Who |
|---|---|---|
| 20 days before | Final policy check; target merchants per service; contract and legal review | Me, with the partner |
| 13 days before | Reference data in the test system: merchant numbers, settlement cycles, fees, keys, routing | Me, settlement, approval team |
| 7 days before | Deployment; production data; approval and cancellation tests | Engineering and me |
| Launch day | First merchant switched; share on the new route watched at 10%, 50% and 100% | Me, with engineering |
| Day after | Fees, payout dates and deposits reconciled; sales compared to catch negative margins | Me, with sales and settlement |

## After launch

Launch surfaced issues the tests could not. I checked customer inquiries as they came in, traced each case and coordinated fixes with engineering and the partner.

- **An unfamiliar name on card statements.** I tested approval and cancellation with every card company, documented how the name appeared in SMS, push notifications and statements, and gave the merchant one reference their customer service could rely on.
- **Missing card-issuer benefits** and **cards that would not go through:** each case traced and fixed with the partner.

**Result:** once the issues settled, payments were split between both routes as planned. The service now runs on two gateways.

## What I'd do differently

I would give reference-data checks more room in the schedule, confirm with real approvals and cancellations that data lands correctly on both sides, and agree statement wording before launch.
