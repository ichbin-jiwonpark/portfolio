---
title: From four checkout steps to a saved card and a PIN
card_title: In-app easy pay
kind: Work
year: 2022
summary_product: Part of the payment team that integrated a cinema chain's own easy pay with eight card companies, the service that later became the base of the group's CJ PAY.
role: Team member, working with a senior colleague: reference data, partner integration, testing, post-launch monitoring
team: Eight card companies, a card-processing (VAN) company, an authentication provider, the merchant's business team, engineering
timeline: CGV: about one year, 2022 · CJ The Market: pilot from Feb 2023
platform: Merchant mobile app (payments side)
image: images/easy-pay/cover.jpg
note: The diagram is drawn for this portfolio. The checkout screens at the end are from the live app, shown for reference only, with card details replaced.
outcome: Launched in the cinema app in 2022; the setup was reused for the group's online food store (pilot from February 2023) and became the base of CJ PAY, launched February 2024
result: Became the base of CJ PAY (2024)
tldr_problem: Card checkout took four steps, two of them outside the app.
tldr_role: Team member with a senior colleague: reference data, merchant IDs with eight card companies, processing and authentication setup, testing.
tldr_impact: Two steps inside the app. The setup was reused and became the base of CJ PAY in 2024.
line_product: Card checkout cut from four steps to two, connected with eight card companies
---

## Background

Around 2022, many Korean consumer brands launched their own easy-pay services. CGV, a cinema chain we processed payments for, wanted one in its app too.

Paying by card in the app took four steps, and two of them happened outside it: choosing a card company, opening that card company's app, authenticating there, and coming back to complete the payment.

![Card checkout before: four steps, two of them outside the app. After easy pay: choose a saved card, enter a 6-digit PIN, paid.](images/easy-pay/checkout-steps.svg)

## What I did

I worked on this as part of the existing payment team, alongside a senior colleague. The merchant built the app screens; our team delivered the payment integration behind them. My part:

- **Reference data:** checked and set up the payment reference data the new method needed
- **Card companies:** contacted each of the eight major Korean card companies to set up dedicated merchant IDs
- **Processing and authentication:** had terminal IDs issued through the card-processing company and confirmed the authentication flow with the authentication provider
- **Integration and testing:** worked through requirements and integration with the merchant's business team and engineering, and tested before launch
- **After launch:** monitored payments and handled issues as they came in

## Result

After registering a card once, customers pay with a saved card and a 6-digit PIN, without leaving the app. It also supported card-issuer promotions that ran only on this payment method.

The CGV service became the starting point for the group's own easy pay. The same setup was reused for CJ The Market, the group's online food store, and piloted there from February 2023. After further improvements, the group launched it officially as CJ PAY in February 2024.

## For reference: the live checkout

I did not design these screens: CGV designed and built the app. They are here only to show where the integration my team delivered appears for customers.

![For reference: the CGV app checkout with easy pay, from choosing easy pay to entering the PIN](images/easy-pay/cgv-checkout.jpg)

*Screens from the CGV app, for reference. Card details are replaced with placeholders.*
