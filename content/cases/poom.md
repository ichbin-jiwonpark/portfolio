---
title: POOM, a wellbeing app where rest counts as progress
card_title: POOM
kind: MA thesis
year: 2026
image: images/poom/cover.jpg
summary_design: A wellbeing app built on the flow of Taekwondo poomsae. Progress never goes backwards, rest is recorded too, and no day is ever left blank.
role: Solo: research, concept, UX and UI design, prototype, usability testing
platform: Mobile app concept · Figma prototype
timeline: Master's thesis · submitted July 2026
grade: 94.1 / 100
outcome: Prototype tested with one participant; master's thesis graded 94.1/100
result: Grade 94.1 / 100
line_design: A wellbeing app where rest counts as progress, built on the flow of Taekwondo poomsae
---

## Background

Fitness apps are built to track progress, but for many people they become a source of guilt. A missed day shows up as an empty ring or a broken streak, and rest simply does not count.

My research question: **How can the design of a mobile wellness app address the emotional barriers that come with activity tracking?**

## Discovery

**Interviews.** I ran semi-structured interviews over Zoom with three people in their early to mid-30s who had used fitness apps and stopped. The questions covered three areas: how they used the apps, why and how they stopped, and what an app they would actually keep would look like.

All three described the same thing in different words:

- "It felt like I was exercising just to log it. The tool had become the goal." (Interviewee A, who stopped wearing an Apple Watch)
- "When the app displayed an 'X', I felt a sense of guilt for not completing the mission." (Interviewee B)
- "I felt guilty with every breath I took." (Interviewee C)

From the interviews I drew three pain points:

1. **Pressure to log.** People exercised to fill the app's record, not because they enjoyed it. The app worked as a monitor, not a companion.
2. **Guilt on rest days.** An empty ring or a broken streak turns a rest day into a failure. Rest is treated as a gap, not as recovery.
3. **No reward for keeping going.** Logging led to nothing visible, so there was no reason to continue.

The conclusion: the problem is in the structure of the apps, not in people's motivation.

**Comparing apps.** I compared six apps on how they treat rest, gamification, guilt and notifications.

| App | Rest logging | Gamification | Guilt-free | Notifications |
|---|---|---|---|---|
| Apple / Samsung Health | No | No | No | Pressure-based |
| Strava | No | Partial | No | Social comparison |
| Calm | No | No | No | Streak-based |
| Duolingo | No | Yes | Partial | Countdown, urgent |
| Finch | Yes | Yes | Partial | Emotional |
| **POOM** | **Yes** | **Yes** | **Yes** | **Affection-based** |

**Theory.** Four frameworks shaped the design logic: the WHO definition of wellbeing (recovery is part of wellbeing, not only exercise), attention restoration theory (rest restores mental resources), self-determination theory (fear-based engagement such as streaks and penalties works only in the short term) and emotional design (a product should support, not judge).

## Ideate

**The concept.** POOM comes from poomsae, the forms in Taekwondo: a set sequence of movements where no movement is skipped and each flows into the next. The training process itself is the goal. POOM carries that into tracking with one principle: **the flow never breaks.** Just as no movement can be skipped in poomsae, no day can be skipped in POOM.

The design decisions that follow from it:

- **No empty days.** A day counts in one of three ways: exercise synced from Apple or Samsung Health (+3 XP), "I did something for me", such as meditation, a hobby or a walk (+2 XP), or "I did nothing" (+1 XP). If someone does not open the app for 24 hours, a gentle notification arrives. Whether or not they answer, the day is recorded as a recharge day.
- **XP never goes down.** Progress only moves forward, so there is nothing to lose and no streak to break.
- **"Recharge", not "rest".** Rest can read as an absence of effort; recharge reads as recovery. The home button says "Recharged myself", and "I did nothing" comes with "And that's okay. It recharges you."
- **Exercise and recharge carry equal weight.** The two buttons on the home screen have the same size and place. The home screen shows no statistics, so opening the app never starts with a performance check.
- **Belts paced by habit research.** Six belts, from white to black, at 30, 90, 210, 390 and 750 XP, roughly 7, 30, 60, 90 and 180 days of balanced records. The first step is short so people feel progress early; later steps widen, following research that a new habit takes 66 days on average to become automatic.
- **A landscape that grows instead of a number.** At the centre of the home screen, a landscape fills in with each belt: sun and flowers, then trees and birds, water, a sunset, and finally a night sky full of stars. Just before a level-up, the next belt's elements appear at 20% opacity as a preview.
- **Colours with meaning.** The belt colours come from obangsaek, the traditional Korean five-colour system, and the whole interface takes on the current belt's colour. The record charts use the three colours of samtaegeuk, a Korean symbol of three forces in balance, for exercise, active recharge and passive recharge.
- **Rewards that value rest too.** Each belt brings a real reward that fits its stage, and the first one rewards rest, not effort.

| Belt | Reward | Why this reward |
|---|---|---|
| White | Welcome Kit | A start that invites people to keep recording |
| Yellow | Rest Pass | The flow is established, so rest is earned: exercise and recharge count equally |
| Green | Hobby platform trial pass | Active recharge as a form of self-investment |
| Blue | Hobby platform discount | Keeps the recharge habit going |
| Red | Premium recharge content | Ninety days of balance |
| Black | Mentor badge | After 180 days, the user becomes a practitioner |

**A business model behind the rewards.** The rewards are designed as a partnership model: wellness and hobby platforms, such as Urban Sports Club or ClassPass, provide passes and discounts, and POOM links to them from the Rewards tab. The user gets tangible value for keeping the flow, and partners reach people who are building a habit. In the thesis this stays at concept level; partnerships and feasibility are future work.

![The home screen moving through the six belts, from white to black, as the landscape fills in](images/poom/belts.webp)

*One home screen through all six belts: the landscape grows from an empty sky to a sky full of stars.*

## Outcome

I designed the full flow in Figma: onboarding, home, logging, level-up, the 24-hour notification and the record tab.

![Onboarding: welcome, every day counts, your world changes with you, the flow never breaks](images/poom/onboarding.jpg)

*Onboarding explains the idea in four messages before the first screen.*

![Home screen at white belt and at yellow belt](images/poom/home.jpg)

*Home at white and yellow belt. The XP ring only fills, and the interface takes on the belt colour.*

![Bottom sheets for logging exercise and logging a recharge](images/poom/logging.jpg)

*Exercise syncs from the phone's health app, with a manual option. Recharge offers "I did something for me" or "I did nothing".*

![Level-up from white to yellow belt, with the Rest Pass unlocked](images/poom/level-up.jpg)

*Level-up: the whole interface turns yellow and the first reward appears.*

![The 24-hour notification, the passive recharge prompt, and the welcome-back message](images/poom/notification.jpg)

*After a day away: a gentle notification, then "You were away, and that's totally okay" with the missed days already recorded.*

![Record tab: weekly history, monthly history, and the rewards earned at each belt](images/poom/record.jpg)

*History has no empty bars, because every day is recorded. Rewards lists what each belt has unlocked; tapping Use opens the partner's service.*

## Testing

I tested the Figma prototype with one participant from the interviews, in a 40-minute walkthrough over Zoom, covering onboarding, logging, history and rewards.

**What worked**

- The participant understood the core idea, including passive recharge, without any explanation
- The reasoning behind the belt thresholds made sense once the habit research was explained
- The Taekwondo design language felt coherent

**What to improve**

- The guilt-free idea was not visible enough on the home screen, so it still felt somewhat like a typical fitness app
- In the history view, the chart and its labels sat too far apart to read at a glance
- Synced activities may include things a person does not count as exercise, so they need manual editing
- The rewards screen felt more commercial than the rest of the app

**Feedback at the thesis defence.** The examiners praised bringing Taekwondo philosophy into the concept, the fit between the design and the concept, and the message that rest matters for wellbeing too. They also raised three points:

- Testing with one participant is too small a sample
- European users may not know poomsae or the belt system, so the concept could use a short guide that explains it
- In a next round, the record dashboard could be developed further

**What it taught me.** Designing the right logic is one challenge; making people see that logic on the screen is another. With one participant the results cannot be generalised, so the next steps are testing with more and more varied people, a short guide to the Taekwondo ideas for users who don't know them, making the guilt-free idea visible on the home screen, a stronger record dashboard, and short weekly messages based on activity patterns, such as noting that someone gave themselves a lot of time to rest that week.
