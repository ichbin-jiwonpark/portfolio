---
role: Screen planning (all but the settlement screens): requirements from each team, screen concepts, iteration with engineering
---

## Background

The company's payment gateway already reached the card companies through several VAN routes. The project added a second payment gateway, an external partner, as a backup for card payments. Payments on the partner route did not pass through our gateway at all.

That changed the daily work of everyone who ran payments. Operations, sales support and finance all worked in the same back office, and every screen they used had been built around one gateway. Each of them now had to know, at a glance, which gateway had handled a payment and where its data lived.

![Our gateway already reached the card companies through several VANs; a partner gateway was added alongside as a backup](images/routing/routes.svg)

## Users and their questions

I started from the questions each team would need to answer in the back office once the partner route was live:

- **Who is this partner, and how is it set up?** The partner had to exist as a new kind of payment partner, with its own deposit accounts, next to the card companies.
- **Which of our IDs belongs to which partner ID?** Each of our terminal IDs had to map to the partner's merchant ID and to the card-company number the partner had received, so payments could be traced in both systems.
- **Which gateway processed this payment?** Operations and customer service searched transactions every day and needed to filter and see the route.
- **How much went through each route?** Volume statistics needed to separate the partner route from the rest.

## How the screens came together

I planned the screens, apart from the settlement screens, which a colleague designed. The process ran in a loop:

1. **Collect requirements from each team:** what they checked, in which screen, and what would change for them
2. **Sketch the screens with their input:** I proposed where each answer would live and asked for their opinion before going further
3. **Check feasibility with engineering:** what the existing back office could support, and what it could not
4. **Take it back to the team:** where engineering suggested another way, I brought that back to the team and settled it there

**Extend, don't rebuild.** The back office was in daily use for live payments. Rather than new screens, most answers became one new value or filter in a screen people already knew: a new partner type, the partner in the existing deposit-account and mapping screens, and a route filter in transaction search that defaults to showing everything.

**Launch first, the rest next.** The changes were split into two phases. What operations needed from the first day went into the first release; label changes in merchant management, the route flag in volume statistics and an export of the mapping data were planned for a second phase.

## Screens

![Integration mapping: our terminal IDs mapped to the partner's merchant IDs and the card-company numbers it received](images/routing/screen-map.jpg)

*Reference data: each of our terminal IDs mapped to the partner's merchant ID and to the card-company number the partner received, in the mapping screen staff already used.*

![Transaction search with a route filter and route and processing-code columns](images/routing/screen-tx.jpg)

*Transaction search: a new route filter and two new columns, so operations can see at a glance which gateway processed a payment.*

## What customers saw

One issue only appeared after launch, outside the back office. Existing customers saw an unfamiliar merchant name on their card statements and asked what the charge was. The name is set by each card company's own rules, so it could not simply be changed. I ran approval and cancellation tests across all card companies, documented how the name appeared in SMS, app push notifications and on the statement for each one, and gave this reference to the merchant, so their customer service could answer with certainty.

## Reflection

If I did this again, I would settle the wording customers see on statements and notifications in advance, and check with real approvals and cancellations that the data lands correctly in both our payment system and the partner's, so that as many cases as possible are caught before launch, not after.
