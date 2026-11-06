---
role: Process analysis and screen design; specification co-written with a planning colleague
title_design: Regulated card fees: a 9-step Excel process redesigned as one back-office tool
summary_design: Mapping a manual process across four roles, then designing upload, lookup and bulk-update screens that make source data visible and checkable.
stats_design: 9 steps :: across four roles, mapped before designing || 4–5 → 1 :: screens for card-company data merged into one || ~3 weeks → ~1 day :: per half-yearly update, by my estimate
skills_design: Process mapping · Back-office UX · Bulk data tools · Error prevention · Design specs · Designing within legacy constraints
tldr_problem_design: Every half-year, fee tiers were updated through a 9-step manual Excel process. An error meant a wrong card fee and real money lost.
tldr_role_design: I mapped the process and designed the screens, and co-wrote the specification with a planning colleague.
tldr_impact_design: Built as designed and in use from the second half of 2024. By my estimate, about three weeks of work became about a day.
---

## The problem

In South Korea, small merchants pay reduced card fees set by law in revenue tiers, and new tier lists arrive every half-year. Each list has to become the right fee per merchant and the right processing group. A mistake means a refund to the merchant or a loss for the company.

## Users and constraints

**Users:** internal operations staff across external relations, sales and sales support.

**Constraint:** the back office was in daily use for payments, so new functions went into new screens next to the existing ones, and cases the system could not cover got an operating rule in the specification.

## Mapping the process

I mapped the half-yearly update step by step to find where errors came in.

| Stage | What happened | Where errors came in |
|---|---|---|
| Receive data | Large text files copied into Excel by hand | Merchants lost in copy-paste; no check against the source |
| Check | Each role checked its own part; fee tables kept outside the system | Omissions and inconsistent fee data |
| Apply | Apart from large merchants, entered one merchant ID at a time | Wrong registrations, slow manual entry |
| Monitor | Only payment success visible on switch day | Fee errors found the next day, after settlement |

**What the map showed:** the problem was not one bad screen. Data was re-typed between people and files, so nobody could check it against the source.

## Design decisions

![Four steps from the association's tier lists to the right fee and processing route for each merchant](images/fee-tier/steps.svg)

- **Upload the source, not a copy:** staff upload the association's original file, so nobody re-types merchant lists.

![Uploading the association's file: choose period and tier, confirm, then decide on existing business numbers](images/fee-tier/screen-upload.jpg)

*A confirmation restates period and tier, and existing business numbers are counted before anything is overwritten.*

- **Show the change, not just the state:** this period's tier sits next to the previous one, so staff see who moved.

![Merchant tiers with the previous period's tier and a list of merchant IDs for one business](images/fee-tier/screen-merchants.jpg)

- **Exceptions as data:** a flag with a reason, instead of a note in a separate document.

![Merchant details with the fee-tier exception flag and its reason](images/fee-tier/screen-exception.jpg)

- **Set once, switch automatically:** fees for every tier registered up front per card company.

![Fees for every tier and every card company in one pop-up](images/fee-tier/screen-fees.jpg)

- **One screen instead of four or five** for a card company's merchant number, fees and payout cycle.

![A card company's merchant number, fees and payout cycle on one screen](images/fee-tier/screen-partner.jpg)

## Outcome

- **Built as designed:** upload and lookup, fees per tier, one card-company screen and bulk updates
- **Faster:** by my estimate, about three weeks of work became about a day per update
- **Fewer errors:** the colleagues who run it told me human error dropped sharply
- **Restructured:** processing groups, unchanged for nearly 20 years, now match the fee tiers

## Reflection

Parts of the back office still feel more complex than they need to be. With time to dig into its history, I would simplify it further.
