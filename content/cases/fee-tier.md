---
title: Turning a half-yearly manual process into a back-office tool for regulated card fees
card_title: Fee-tier management tool
kind: Work
year: 2023
summary_product: Replacing an error-prone half-yearly Excel process with back-office screens, so small merchants get the reduced card fees the law gives them.
summary_design: Mapping a 9-step manual process across four roles, then designing upload and lookup screens that make source data visible and checkable.
role: Product Manager: process analysis, screen design and specification
team: Me and one planning colleague, back-office engineering, sales, sales support and external-relations staff
timeline: Planning Oct 2023 · in operational use from [the following half-year]
platform: Internal back-office (web)
users: Internal operations staff who run the half-yearly fee update
---

## Background

In South Korea, small and medium-sized merchants pay reduced card fees, set by regulation in revenue tiers (general, small, medium 1–3). Every half-year, the card industry association sends payment companies new lists of which merchant belongs to which tier.

For a payment service provider, that list has to turn into three things: the right fee for each merchant, the right fee from each card company, and payments routed through the right processing group so the reduced rate actually applies. A mistake in any of them means a merchant is charged the wrong fee.

## Discovery

Every half-year, the update ran as a 9-step manual process across four roles. I mapped it step by step to find where errors entered.

| Step | Who | What happened | Where errors came in |
|---|---|---|---|
| 1. Check last period | Engineering, external relations | Data extracted on request, checked by hand in Excel | Manual verification |
| 2. Receive association data | External relations | Large text files per tier were copied into Excel by hand; the system stored them but did not show them | Merchants lost in copy-paste; source data could not be verified |
| 3. Write check guide | External relations | Exceptions (excluded payment types, specific merchants) described in a document | Exceptions missed when applied by hand |
| 4. Second check | Sales, sales support, external relations | Each role checked its part; merchant fee tables were kept by individual sales staff, outside the system | Omissions; inconsistent fee data |
| 5–6. Review & final check | All | Files from each person merged and compared by eye | Reconciliation errors |
| 7–8. Apply changes | Sales support | Large merchants via bulk form, the rest entered one merchant ID at a time | Wrong registrations, slow manual entry |
| 9. Monitor | All | On switch day only payment success was visible; fee errors showed the next day after settlement | Errors found only after they happened |

**What the map showed:** the problem was not one bad screen. Data was re-typed between people and files, so no one could check it against the source, and errors became visible only after the new fees had gone live. In practice this also led to payments being routed under the wrong processing group.

## Ideate

I split the improvement into four steps and scoped the first release to the root cause: getting the source data into the system, visible and checkable.

1. **Upload the source file, not a copy.** Staff upload the association's original file per year, half-year and tier. Nobody re-types merchant lists, and the system keeps the source.
2. **Guard against the wrong upload.** Before saving, a confirmation restates the year, half-year and tier selected. If business numbers already exist, the screen shows how many and asks whether to update or cancel.
3. **Show the change, not just the state.** The merchant lookup shows the selected period next to the previous one, so staff see who moved tiers. Each business number shows how many merchant IDs it covers; one click opens the list and links to each merchant's settings.
4. **Fit the workflow people already had.** The Excel export keeps the format staff already used for their checks, with two added columns: the exception flag and the previous-period tier.
5. **Make exceptions part of the data.** Each merchant can carry an exception flag with a reason, for example merchants whose payments run under a head office's business number. A note on screen says the displayed tier is based on the registered business number and may differ from the processing group's.

**Proposed for later steps** [label as proposed unless implemented]:

- Register a merchant's fees for every tier up front, so the fee switches automatically when the tier changes
- Bring card-company merchant data from 4–5 separate screens into one
- Bulk update of processing groups

## Outcome

[Redrawn screens: upload flow, merchant tier lookup, exception flag]

## Delivery & result

The back-office system was in daily use for payments, so the constraint was clear: change as little of it as possible. In meetings with the back-office developer, we worked out an implementation within that limit.

- New functions were added as new screens, next to the existing ones, rather than rebuilding screens staff relied on
- Open technical questions were written into the specification itself, for example which file formats the upload accepts, and how merchant IDs created after the data load get their tier
- Where the system could not cover a case, the specification proposed an operating rule instead, such as holding new merchant IDs until the switch-over at midnight

Alongside the screens, I reorganised the processing group names and setup to match the fee tiers, and redefined how they are set up.

**Result.**

- The first release was implemented as designed and used in operations from [the following half-year]
- It replaced the manual Excel processing of the association's data, which had been very time-consuming and had led to payments routed under the wrong processing group

## Reflection

[Your own words, 1–2 sentences]
