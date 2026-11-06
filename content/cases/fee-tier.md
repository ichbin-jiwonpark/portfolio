---
title: Turning a half-yearly manual process into a back-office tool for regulated card fees
card_title: Fee-tier management tool
kind: Work
year: 2023–2024
image: images/fee-tier/cover.jpg
summary_product: Replacing an error-prone half-yearly process with back-office tools, so small merchants get the reduced fees the law gives them.
summary_design: Mapping a 9-step manual process across four roles, then designing upload, lookup and bulk-update screens that make source data visible and checkable.
role: Product Manager: process analysis, screen design and specification
team: Me and one planning colleague, back-office engineering, sales, sales support and external-relations staff
timeline: Specification Oct 2023 · released before I left in July 2024 · in use from the second half of 2024
platform: Internal back-office (web)
users: Internal operations staff who run the half-yearly fee update
note: Screens and diagrams are redrawn for this portfolio with fictional merchants and fee rates, following the specification I co-wrote and the implemented system. Internal documents are not reproduced.
outcome: Live from the second half of 2024. By my estimate, the half-yearly update went from about three weeks of manual work to about a day
result: ~3 weeks → ~1 day per half-year
tldr_problem: Every half-year, regulated fee tiers were updated through a 9-step manual Excel process across four roles. An error meant a wrong card fee: a refund to the merchant or a loss for the company.
tldr_role: I mapped the process and designed the screens, and co-wrote the specification with a planning colleague.
tldr_impact: Live from the second half of 2024. By my estimate, about three weeks of work became about a day. Former colleagues report far fewer errors.
line_design: A 9-step Excel process mapped and replaced by upload, lookup and bulk-update screens
line_product: A three-week, error-prone Excel process turned into about a day of upload and checks
title_product: Regulated card fees: from three weeks of Excel to about a day
stats_product: ~3 weeks → ~1 day :: per half-yearly update, by my estimate || 9 steps :: across four roles, mapped to find where errors came in || ~20 years :: since the processing groups were last restructured
skills_product: Process mapping · Back-office tooling · Regulated card fees · Data quality · Specification writing · Change with minimal risk to live payments
---

## The problem

In South Korea, small merchants pay reduced card fees set by law in revenue tiers. Every half-year, the card industry association publishes new tier lists. For us, each list had to become three things: the right fee for each merchant, the right fee from each card company, and payments routed through the right processing group.

A mistake costs money. The wrong processing group means the wrong card fee: either we refund the merchant, or we absorb the difference.

I mapped the half-yearly update step by step to find where errors came in.

| Stage | What happened | Where errors came in |
|---|---|---|
| Receive data | Large text files copied into Excel by hand | Merchants lost in copy-paste; no check against the source |
| Check | Each role checked its own part; fee tables kept outside the system | Omissions and inconsistent fee data |
| Apply | Apart from large merchants, entered one merchant ID at a time | Wrong registrations, slow manual entry |
| Monitor | Only payment success visible on switch day | Fee errors found the next day, after settlement |

**What the map showed:** the problem was not one bad screen. Data was re-typed between people and files, so nobody could check it against the source.

## Key decisions

- **Source data first:** staff upload the association's original file, so every list can be checked against its source.
- **New screens next to the existing ones,** instead of rebuilding them, so live payments were touched as little as possible.
- **Processing groups restructured** to match the fee tiers, instead of fitting new tiers into groups unchanged for about 20 years. The decision I'm proudest of.

## What I built

![Four steps from the association's tier lists to the right fee and processing route for each merchant](images/fee-tier/steps.svg)

- **Upload, not re-type:** the original file goes in per year, half-year and tier; a confirmation and a count of existing business numbers prevent the wrong upload.
- **See the change:** this period's tier next to the previous one, so staff see who moved.
- **Exceptions as data:** a flag with a reason, instead of a note in a document.
- **Apply in bulk:** fees registered for every tier up front, card-company data on one screen instead of four or five, and processing groups updated in bulk.

![Uploading the association's file: choose period and tier, confirm, then decide on existing business numbers](images/fee-tier/screen-upload.jpg)

*The period and tier are confirmed before upload, and existing business numbers are counted before anything is overwritten.*

![Merchant tiers with the previous period's tier and a list of merchant IDs for one business](images/fee-tier/screen-merchants.jpg)

*This period's tier next to the previous one.*

![Fees for every tier and every card company in one pop-up](images/fee-tier/screen-fees.jpg)

*Fees for every tier, registered once per card company.*

## Result

- **Faster:** by my estimate, the half-yearly update went from about three weeks to about a day. The upload and comparison took two to three hours
- **Fewer errors:** the colleagues who run it told me human error dropped sharply
- **Low risk to build:** new functions added beside the existing screens; open technical questions and fallback operating rules written into the specification
- **In use:** released before I left in July 2024, and used from the second half of 2024

## What I'd do differently

Parts of the back office still feel more complex than they need to be. With time to dig into its history, I would simplify it further.
