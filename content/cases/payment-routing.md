---
title: Payment redundancy for stable card payments: adding a second processing route without stopping the service
card_title: Payment redundancy
kind: Work
year: 2021
image: images/routing/cover.jpg
image_design: images/routing/cover-design.jpg
summary_product: Building payment redundancy for stability: a second processing route for live card payments, from partner tender and service policy to a phased launch and post-launch fixes.
summary_design: Working out what operations, sales support and finance needed to tell a second payment gateway apart, and turning their questions into back-office screens.
role: Product Owner (lead): partner selection, service policy, reference data, screen planning, testing, launch plan, issue response
team: Engineering, operations, sales, sales support, settlement, a back-office planning colleague (settlement screens), legal and procurement, an external payment partner
timeline: First discussed 2019 · active from 2020 · launched April 2021
platform: Payment gateway and back-office
scope: Credit card payments of one merchant group, rolled out service by service
note: Screens and diagrams are redrawn for this portfolio with fictional data, following my screen plans and the implemented system. Partner and merchant names are left out, and the settlement screens, designed by a colleague, are not shown.
outcome: Launched in April 2021, service by service; after the post-launch fixes the route ran as part of normal operations
result: Launched in Apr. 2021
tldr_problem: The payment service relied on a single gateway. Adding a second route meant changing how live payments were approved, cancelled, settled and reported.
tldr_role: Product owner, my first project run from zero to launch: partner tender, service policy (40 questions with the partner), reference data, screens (except settlement), tests, launch plan and issue handling.
tldr_impact: The second route went live in April 2021 for one merchant group, switched service by service without stopping payments. Post-launch issues were traced and resolved, and the route ran as part of normal operations.
line_design: Back-office screens that show which gateway processed each card payment
line_product: A second processing route for live card payments, from tender to phased launch
---

## Background

The company's payment gateway already reached the card companies through several VAN routes (the networks that carry card transactions between a gateway and the card companies). What it did not have was a second gateway. The project connected an external payment gateway as a second processing route for card payments, so that the service no longer relied on a single gateway. Payments on the partner route did not pass through our gateway at all. In Korea this setup is called "PG-to-PG": one payment gateway processing payments through another.

This meant changing how live payments were approved, cancelled, settled and reported, for merchants whose customers were paying every day. It was the first project I ran from zero to launch as a product owner: the policy, the reference-data requirements, the screens and the launch plan all started with me.

![Our gateway already reached the card companies through several VANs; a partner gateway was added alongside as a backup](images/routing/routes.svg)

## Key decisions

- **A formal tender** with existing and new partners, with legal and procurement.
- **Overseas cards excluded,** because the required authentication was not available on this route.
- **Launched service by service,** starting with recurring and manual card payments, instead of switching everything at once.
- **Card-statement names made a documented standard** after testing every card company, because card-company rules prevented changing them.

## Choosing the partner

I invited both existing and new partners and ran the selection as a formal tender under company rules, with legal and procurement involved.

## Defining how the service works

I wrote the service policy that engineering and operations built against. It answered the questions a new payment route raises:

- **Onboarding:** merchants are registered through partner merchant IDs instead of a separate review by each card company
- **Money flow:** settlement cycle, full and partial cancellation before and after card-company capture, monthly tax invoices
- **Card rules:** instalment limits, card-issuer interest-free campaigns, and which cards are supported. Overseas cards were excluded because the required authentication was not available on this route
- **Data mapping:** how our merchant and terminal data maps to the partner's IDs, including exception cases such as employee discounts, so no payment falls through

To pin these down, I went through 40 policy questions with the partner and recorded each answer: merchant ID rules and changes, settlement and payout cycles, cancellation and partial cancellation, payment and instalment limits, interest-free campaigns, receipts, terms, fees, and who to contact when something breaks.

I also planned the back-office screens, apart from the settlement screens, which a colleague designed. Operations and finance needed to tell the new route apart in reference data, transaction search and statistics. I collected the requirements from each team, sketched the screens with their input and checked with engineering what could be built. Where something could not, I took engineering's suggestion back to the team and settled it there.

![Integration mapping: our terminal IDs mapped to the partner's merchant IDs and the card-company numbers it received](images/routing/screen-map.jpg)

*Reference data for the second route: each of our terminal IDs mapped to the partner's merchant ID and to the card-company number the partner received.*

![Transaction search with a route filter and route and processing-code columns](images/routing/screen-tx.jpg)

*Transaction search with a new route filter and new columns, so operations can see at a glance which route processed a payment.*

## Testing and phased launch

The project ran from 2020, when the partner tender started, to the launch in April 2021.

![Timeline: first discussed in 2019, tender, policy, screens and tests from 2020, launch in April 2021, then post-launch fixes and normal operations](images/routing/timeline.svg)

**The last three weeks.** For the final stretch before launch, I turned the remaining work into a day-by-day plan with an owner for every step, across sales, sales support, settlement, engineering, the approval team and the partner.

| When | What | Who |
|---|---|---|
| 20 days before | Final policy check with the partner; card attributes and target merchants checked per service; merchant ID requests, contract and legal review | Me, with the partner |
| 16 to 10 days before | Three development check-ins before deployment | Engineering |
| 13 days before | Reference data in the test system: the partner, merchant numbers and settlement cycles, fees and integration keys; deposit accounts; routing groups | Me; settlement for accounts; the approval team for routing |
| 7 days before | Deployment; the same reference data in production; approval, cancellation and partial-cancellation tests | Engineering and me |
| Launch day | First merchant switched; share of payments on the new route watched at 10%, 50% and 100% | Me, with engineering |
| Day after | Fees, payout and deposit dates checked; sales compared before and after the switch to catch negative margins; deposits reconciled | Me, with sales and settlement |

With engineering and the partner, I tested authorisation and cancellation. Settlement could not be tested before launch, so it was monitored closely after go-live.

Instead of switching everything at once, the launch started with one merchant group and moved through its services one by one, starting with recurring and manual card payments.

## After launch

The launch surfaced issues the tests could not, and I checked incoming customer inquiries as they arrived, traced each case and coordinated fixes with engineering and the partner.

- **A different name on card statements.** Existing customers saw an unfamiliar merchant name and asked what the charge was. The name is set by each card company's own rules, so it could not simply be changed. I ran approval and cancellation tests across all card companies, documented exactly how the name appeared in SMS, app push notifications and on the actual statement for each one, and gave this reference to the merchant. We agreed this would be the standard, so their customer service could answer with certainty.
- **Missing card-issuer benefits.** Some card-issuer benefits did not apply on the new route; each case was traced and handled with the partner.

Once the issues settled, the route ran as part of normal operations.

## Reflection

If I did this again, I would make the reference-data check more systematic and give it more room in the schedule. Beyond the planned tests, I would confirm with real approvals and cancellations that the data lands correctly in both our payment system and the partner's, and settle the wording customers see on statements and notifications in advance, so that as many cases as possible are caught during development and operations testing, not after launch.
