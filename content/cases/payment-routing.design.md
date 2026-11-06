---
role: Screen planning (all but the settlement screens): requirements from each team, screen concepts, iteration with engineering
title_design: Back-office screens for a second payment gateway, without rebuilding what staff relied on
summary_design: Turning the questions of operations, sales support and finance into small changes to screens they already knew.
stats_design: 4 :: questions the back office had to answer at a glance || 2 :: new columns and one filter in transaction search || 2 phases :: day-one needs first, the rest planned next
skills_design: Requirements gathering · B2B back-office UX · Designing within legacy constraints · Iterating with engineering · Phased delivery
tldr_problem_design: Every back-office screen was built around one gateway. With a second one, staff could no longer tell which gateway had handled a payment.
tldr_role_design: I planned the back-office screens (a colleague designed settlement): requirements, sketches and iteration with engineering.
tldr_impact_design: Launched in April 2021 as one new filter or value in familiar screens, so staff could see which route processed a payment.
---

## The problem

The company added an external partner as a second payment gateway for card payments. Payments on the partner route did not pass through our gateway at all.

Operations, sales support and finance all worked in one back office built around one gateway. Each of them now had to see, at a glance, which gateway had handled a payment and where its data lived.

![Our gateway already reached the card companies through several VANs; a partner gateway was added alongside as a backup](images/routing/routes.svg)

## Users and their questions

- **Who is this partner?** A new kind of payment partner, with its own deposit accounts, next to the card companies.
- **Which of our IDs belongs to which partner ID?** Each terminal ID mapped to the partner's merchant ID and the card-company number.
- **Which gateway processed this payment?** Operations searched transactions daily and needed to filter by route.
- **How much went through each route?** Volume statistics needed to separate the routes.

## Process

1. **Collect** what each team checked, in which screen, and what would change for them
2. **Sketch** where each answer would live, and ask the team before going further
3. **Check** with engineering what the existing back office could support
4. **Settle** alternatives from engineering with the team

## Design decisions

- **Extend, don't rebuild:** most answers became one new value or filter in a screen people already knew, with a route filter that shows everything by default.
- **Launch first, the rest next:** day-one needs in the first release; label changes, a route flag in statistics and a mapping export in a second phase.

![Integration mapping: our terminal IDs mapped to the partner's merchant IDs and the card-company numbers it received](images/routing/screen-map.jpg)

*Reference data: each terminal ID mapped to the partner's merchant ID, in the mapping screen staff already used.*

![Transaction search with a route filter and route and processing-code columns](images/routing/screen-tx.jpg)

*Transaction search: a route filter and two new columns show which gateway processed a payment.*

## What customers saw

After launch, customers saw an unfamiliar merchant name on card statements. The name is set by each card company, so I tested every card company and documented how it appeared in SMS, push notifications and statements. The merchant's customer service could then answer with certainty.

## Reflection

Next time, I would settle the wording customers see before launch, and check with real approvals and cancellations that data lands correctly on both sides.
