---
title: Turning a half-yearly manual process into a back-office tool for regulated card fees
card_title: Fee-tier management tool
kind: Work
year: 2023–2024
image: images/fee-tier/cover.jpg
summary_product: Replacing an error-prone half-yearly Excel process with back-office tools, so small merchants get the reduced card fees the law gives them, with far fewer costly errors.
summary_design: Mapping a 9-step manual process across four roles, then designing upload, lookup and bulk-update screens that make source data visible and checkable.
role: Product Manager: process analysis, screen design and specification
team: Me and one planning colleague, back-office engineering, sales, sales support and external-relations staff
timeline: Specification Oct 2023 · released before I left in July 2024 · in use from the second half of 2024
platform: Internal back-office (web)
users: Internal operations staff who run the half-yearly fee update
note: Screens and diagrams are redrawn for this portfolio with fictional merchants and fee rates, following the specification I co-wrote and the implemented system. Internal documents are not reproduced.
outcome: Live from the second half of 2024. By my estimate, the half-yearly update went from about three weeks of manual work to about a day
result: Launched in Jul. 2024
tldr_problem: Every half-year, regulated fee tiers were updated through a 9-step manual Excel process across four roles. An error meant a wrong card fee, which led to a refund to the merchant or a loss for the company.
tldr_role: I mapped the process and designed the screens, and co-wrote the specification with a planning colleague.
tldr_impact: Live from the second half of 2024. By my estimate, the update went from about three weeks to about a day. Former colleagues report far fewer errors.
line_design: A 9-step Excel process mapped and replaced by upload, lookup and bulk-update screens
line_product: A three-week, error-prone Excel process turned into about a day of upload and checks
---

## Background

Since 2019, small and medium-sized merchants in South Korea have paid reduced card fees, set by regulation in revenue tiers (general, small, medium 1–3). Every half-year, the card industry association publishes new lists of which merchant belongs to which tier.

For a payment service provider, that list has to turn into three things: the right fee for each merchant, the right fee from each card company, and payments routed through the right processing group so the reduced rate actually applies.

A mistake has a direct cost. If a merchant's payments run under the wrong processing group, the wrong card fee is applied. Then either the company pays part of the fee back to the merchant, or the card company charges its general rate and the company absorbs the difference.

## The problem

The work started each time the association's raw data arrived as text files. I prepared an Excel check template and a list of tasks for engineering, and shared them with the team by email. From there, the update ran as a 9-step manual process across four roles. I mapped it step by step to find where errors entered.

| Step | Who | What happened | Where errors came in |
|---|---|---|---|
| 1. Check last period | Engineering, external relations | Data extracted on request, checked by hand in Excel | Manual verification |
| 2. Receive association data | External relations | Large text files per tier were copied into Excel by hand; the system stored them but did not show them | Merchants lost in copy-paste; source data could not be verified |
| 3. Write check guide | External relations | Exceptions (excluded payment types, specific merchants) described in a document | Exceptions missed when applied by hand |
| 4. Second check | Sales, sales support, external relations | Each role checked its part; merchant fee tables were kept by individual sales staff, outside the system | Omissions; inconsistent fee data |
| 5–6. Review & final check | All | Files from each person merged and compared by eye | Reconciliation errors |
| 7–8. Apply changes | Sales support | Large merchants via bulk form, the rest entered one merchant ID at a time | Wrong registrations, slow manual entry |
| 9. Monitor | All | On switch day only payment success was visible; fee errors showed the next day after settlement | Errors found only after they happened |

**What the map showed:** the problem was not one bad screen. Data was re-typed between people and files, so no one could check it against the source, and errors became visible only after the new fees had gone live.

## Key decisions

- **Source data first:** staff upload the association's original file instead of copying it, so the lists can be checked against the source.
- **New screens next to the existing ones,** so live payments were touched as little as possible.
- **Reorganized the VAN groups,** unchanged for about 20 years, so that groups match the fee tiers. This is the decision I'm proudest of.

## The solution

I split the improvement into four steps and started with the root cause: getting the source data into the system, visible and checkable.

**Step 1: source data in the system.**

1. **Upload the source file, not a copy.** Staff upload the association's original file per year, half-year and tier. Nobody re-types merchant lists, and the system keeps the source.
2. **Guard against the wrong upload.** Before saving, a confirmation restates the year, half-year and tier selected. If business numbers already exist, the screen shows how many and asks whether to update or cancel.
3. **Show the change, not just the state.** The merchant lookup shows the selected period next to the previous one, so staff see who moved tiers. Each business number shows how many merchant IDs it covers; one click opens the list and links to each merchant's settings.
4. **Fit the workflow people already had.** The Excel export keeps the format staff already used for their checks, with two added columns: the exception flag and the previous-period tier.
5. **Make exceptions part of the data.** Each merchant can carry an exception flag with a reason, for example merchants whose payments run under a head office's business number. A note on screen says the displayed tier is based on the registered business number and may differ from the processing group's.

**Steps 2–4: applying the change.**

- Register a merchant's fees for every tier up front, so the fee switches automatically when the tier changes
- Bring card-company merchant data from 4–5 separate screens into one
- Update processing groups in bulk instead of one merchant ID at a time

![Four steps from the association's tier lists to the right fee and processing route for each merchant](images/fee-tier/steps.svg)

The screens below follow the specification I co-wrote with a planning colleague, where I designed the screens. It was implemented as designed.

![Uploading the association's file: choose period and tier, confirm, then decide on existing business numbers](images/fee-tier/screen-upload.jpg)

*Step 1: the period and tier are chosen before the file, a confirmation restates them, and business numbers that already exist are counted before anything is overwritten.*

![Merchant tiers with the previous period's tier and a list of merchant IDs for one business](images/fee-tier/screen-merchants.jpg)

*This period's tier next to the previous one, so staff see who moved. The merchant-ID count opens a list, and each ID links to its settings.*

![Fees for every tier and every card company in one pop-up](images/fee-tier/screen-fees.jpg)

*Step 2: fees for every tier, registered once per card company. Clicking a tier copies the first row down, and one rate can be applied to all when the card companies charge the same.*

## What was built

All four steps were built as designed: source-data upload and lookup, fee registration per tier, one screen for card-company merchant data, and bulk updates of processing groups.

## Launch and result

The back-office system was in daily use for payments, so the constraint was clear: change as little of it as possible. In meetings with the back-office developer, we worked out an implementation within that limit.

- New functions were added as new screens, next to the existing ones, rather than rebuilding screens staff relied on
- Open technical questions were written into the specification itself, for example which file formats the upload accepts, and how merchant IDs created after the data load get their tier
- Where the system could not cover a case, the specification proposed an operating rule instead, such as holding new merchant IDs until the switch-over at midnight

Alongside the screens, I reorganised the processing groups to match the fee tiers and redefined how they are set up. Their names and structure had not changed since the team was founded, nearly 20 years earlier.

**Result.**

- The tool went live before I left in July 2024 and was used for the half-yearly update from the second half of 2024, as former colleagues told me
- By my estimate, the half-yearly update went from about three weeks of manual work to about a day. Uploading the association's file took two to three hours, because the system ran the comparison itself; after that, the work was applying the changes and monitoring them
- The colleagues who run it told me human error dropped sharply, there was far less to keep an eye on, and the time went to other work

## Reflection

Reorganising the processing groups is still the decision I'm most glad about. But nobody knows the history behind the original back-office design anymore, so parts of it still feel more complex than they need to be. With the chance to dig into that history, I would simplify it further.
