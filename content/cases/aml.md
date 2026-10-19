---
title: Building a payment company's first AML system, from regulation to the screens staff use every day
card_title: First AML system
kind: Work
year: 2023–2024
summary_product: Leading a payment company's first anti-money-laundering system, from learning the regulation and choosing a vendor to tuning monitoring rules against real transaction data.
summary_design: Designing the step-by-step customer due diligence flow for a payment company's first AML system, with the branches, checks and locks that compliance requires.
role: Project lead and main point of contact: requirements, vendor selection, screen and flow design, internal regulation, manual
team: Engineering, compliance and legal, HR, finance, information security, ERP, an external AML solution vendor
timeline: 2023–2024 · [launch month]
platform: Internal back-office (web)
users: Sales-support staff who register and verify business customers
---

## Background

A change in Korean regulation made licensed electronic payment companies, including ours, responsible for anti-money-laundering duties: knowing who their business customers are, assessing their risk, screening them against sanctions lists, monitoring transactions, and reporting suspicious ones.

The company had no AML system. The project existed to meet this obligation [by the regulatory deadline], on top of a payment service that was already running every day.

## Discovery

Before the project, AML-related work was spread across departments and done by hand. Customer documents were checked by eye. Each check needed a separate data request to engineering. Due diligence, suspicious-transaction checks and the data for suspicious-transaction reports were all manual, and the internal rules for electronic financial business had not been revised since 2019.

Because the work was scattered, it had been treated as unclear and low-priority. My first job was to make the case for it and turn it into one project.

I started without knowing the legal details, so I learned the regulation and its requirements first. I then collected requirements from every department involved and became the single point where questions, requirements and confirmation requests came together: from compliance and legal, HR, finance, information security, the ERP team, engineering and the vendor.

## Ideate

**Choosing the system.** I selected the AML solution vendor [how: number of vendors compared, tender or not, main criteria].

**Risk rules.** Together with the vendor, I set up the three core checks:

- **Customer risk assessment:** built from the regulatory requirements combined with the vendor's input
- **Sanctions and PEP screening:** against the international lists provided in the vendor's solution; a match during customer verification leads to rejection
- **Transaction monitoring:** rules based on the vendor's practice and international standards. I analysed our actual transaction data and merchant profiles to give input on the thresholds.

**The customer due diligence flow.** I designed every registration screen and branch of the flow in PowerPoint and shared the specifications with engineering. Registration runs in five steps:

1. Business details
2. Representative
3. Beneficial owner, with a branch for customers exempt from this check [which cases]
4. Agent
5. Confirm

Rules built into the flow:

- **A duplicate check must pass** before the next step opens [reason]
- **Once confirmed, the record is locked** until the risk-assessment result arrives the next day [reason]
- **Permissions are separated by service:** payment gateway, gift card and pay services [reason]
- **Re-verification** every three years, or every year for high-risk customers
- **Three outcomes** from the risk result: approved for transactions, on hold, or rejected

## Outcome

The back-office screens were implemented almost exactly as designed.

## Delivery & result

**Delivery.** I took part in the full data-integration and system-planning process with engineering, the ERP team and the vendor. Alongside the system, I revised the company's internal rules for electronic financial business and wrote the registration manual (v2.0, October 2023) for the sales-support team, including as-is and to-be process maps.

**After launch.** Some monitoring rules had thresholds set too low. I met with the vendor to adjust them, and asked engineering to apply adjustments or exceptions for merchants with many small payments. Registering business customers and managing their verification records in the new system became part of my own daily work.

**Result.**

- The company met its AML obligations within the deadline, with its first AML system
- Work that had been scattered and manual became one documented process, with revised internal rules and a manual
- Extracting data for audits became faster [rough before/after, if remembered]

## Reflection

[Your own words, 1–2 sentences]
