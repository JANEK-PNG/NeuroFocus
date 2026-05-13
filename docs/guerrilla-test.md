# Neurosync — 5-user guerrilla test

**Goal:** Find out, in 30 seconds with zero context, whether the calm screen is **legible on its own** — before spending on copy, ads, or instrumentation.

**Cost:** ~$0. ~25 min of you. ~3 min per participant.

**When:** This week.

---

## What you're testing

The one screen at `/index.html` on mobile (375 wide). Specifically:

- Does the time + play button read as "a focus / Pomodoro / meditation timer"?
- Or does it read as "a clock", "a meditation app", "a music player", "I don't know"?
- Does the drawer at the bottom invite a pull, or get ignored?
- Does the topbar (sun / moon icons) read as "theme toggle" or get misread?

You are **not** testing audio, journeys, brainwave bands, or any deep feature. Just the first impression.

---

## Recruit (5 people, no overlap with the team)

Mix of:

- 2 in your immediate orbit who are **NOT** developers or designers (partner, parent, friend in a different field)
- 2 strangers — a café, a co-working space, a park bench. Offer a coffee.
- 1 person who already uses something in the focus / meditation / productivity space (any of Calm, Headspace, Forest, Brain.fm, Pomodoro Lofi Spotify playlist)

Skew younger if you can — 22 to 40, since that's the target band per the persona doc.

---

## Setup (do this once, before any user)

1. Get a public preview URL. Pick whichever is easiest:
   - **Easiest:** drag `/Users/jantrybus/Desktop/Neurosync/index.html` into a fresh GitHub Pages repo or a Netlify drop (https://app.netlify.com/drop) — 30 seconds, you get a real URL.
   - Or run a local server + ngrok / Cloudflare tunnel.
2. Open that URL on your phone. Confirm time renders, play button is tappable, drawer pulls up.
3. Clear localStorage on the test device: open the URL, devtools, `localStorage.clear()`. Reload. Should show a fresh first-run state.
4. Put the phone in airplane mode + WiFi-only so no notifications interrupt the session.
5. Hand strap or stand the phone neutrally so the participant doesn't think "this is the test object" — just "look at this screen".

---

## The script (read this verbatim, do not deviate)

> "Hey, I'm testing an app I'm working on. Can I borrow 3 minutes of your time? I'm going to hand you a phone with a screen open. I won't tell you what it is. Just tell me what you see and what you think it does. There's no right answer — if you don't know, say so."

Hand them the phone. **Start the timer in your head.**

### Q1 (10 seconds, before they touch anything)

> "Without tapping, just looking at it — what is this?"

Capture verbatim. Even "I don't know" is a finding.

### Q2 (still no tap)

> "What do you think the dark circle does?"

### Q3

> "What do you think this app is for?"

### Q4 (now let them tap)

> "Okay — go ahead and use it for a minute. Talk out loud. Tell me what you're trying to do and what's happening."

Sit on your hands. Do not narrate. Do not correct misreadings. Note where they tap and what they say.

### Q5 (after ~1 min)

> "If you had this on your phone, when would you use it?"

### Q6

> "On a scale of 1 to 5: how interested would you be in trying this for a week? 1 = I'd delete it, 5 = I'd open it tomorrow."

(Don't argue with the number. Just write it down.)

### Q7 (free)

> "Anything that confused you, or anything you wish were there?"

Stop the recording, thank them, hand them coffee.

---

## What to write down (per user, single page)

```
Participant: __  Age range: __  Familiar with focus apps? Y/N

Q1 (what is this?):
Q2 (what does the circle do?):
Q3 (what's the app for?):
Q4 (use the app):
  - first tap target: __
  - did they find the drawer? Y/N — how long? __ sec
  - did they figure out theme toggle? Y/N
  - any confusion or hesitation: __
Q5 (when would you use it?):
Q6 (1–5 interest): __
Q7 (open notes):

WAS THE CALM-SCREEN BET LEGIBLE? (your call):
  ✅ they got it within 10 sec, unprompted
  ⚠️ they got it after using it
  ❌ they never got it
```

---

## Reading the results

After all 5 are done, ask yourself the three questions that matter:

### 1. Did the time + play button alone communicate "focus timer"?

- **5/5 got it cold** → ship it, the bet works
- **3–4/5 got it** → the bet works but copy could carry more weight (e.g. session-label "classic · 25 min" might need a verb: "focus for 25 min")
- **0–2/5 got it** → the bet fails. We are too quiet. The phase-line ("begin where you are") may be too poetic and not enough functional. Consider adding a small subtitle: "focus timer" or "Pomodoro with sound".

### 2. Did they find the drawer?

- If 4–5 found it within 10 seconds → the handle works
- If 2–3 → the "drawer" label or grab needs more weight, or it needs a one-time first-run hint
- If 0–1 → the entire secondary surface is invisible; the whole product looks like just a clock

### 3. The "when would you use it?" answers

The pattern matters more than any single answer. Healthy answers cluster around:

- "When I sit down to work"
- "Studying"
- "Trying to focus / not get distracted"
- "Falling asleep" (drift case — fine but not the core)

Unhealthy patterns:

- "I'd use it to track time" (it's not a stopwatch; people who say this are reaching)
- "I don't know" → product is unclear
- "Like a clock" → time-display is dominating too hard

---

## What you do with the findings

| Finding | Action |
|---|---|
| 4–5/5 get the bet, 4–5 find drawer | Ship. Spend the next week on the audio engine cleanup. |
| Bet works, drawer hidden | Add a one-time pulse on the drawer-grab on first run. Re-test 3 users. |
| Bet ambiguous, drawer fine | Strengthen the session-label copy. "classic · 25 min" → "focus · 25 min". Re-test 3 users. |
| Bet fails outright | The calm screen is too quiet. Add a small functional subtitle under the phase-line: "a quiet Pomodoro timer". Re-test 5 users. |
| Interest avg < 2.5 | The product isn't wanted by this audience. Go back to user-research.md and re-pick a persona. |
| Interest avg 2.5–3.5 | Concept is alive but not magnetic. Worth iterating, not worth a launch yet. |
| Interest avg 3.5+ | You have something. Stop iterating the screen, start building the habit loop (day-2, day-7 returns). |

---

## What this test does NOT tell you

- Whether the audio actually helps anyone focus (different study — see user-research §6)
- Whether they'll come back tomorrow (diary study, 2 weeks, see user-research §6)
- Whether the brainwave-entrainment claim is believed (belief survey, see user-research §6)
- Whether they'll pay (a long way off)

This test is only about whether the *first 30 seconds* are clear.

---

## Practical checklist for the test day

- [ ] Public URL works on cellular (not just your WiFi)
- [ ] Phone fully charged
- [ ] localStorage cleared before each participant
- [ ] Theme set to light by default (warm paper is the hero look)
- [ ] Notebook + pen (don't take notes on the test phone — they'll watch you)
- [ ] $20 of coffee shop credit ready
- [ ] Five blank participant pages printed or in a notes app
- [ ] One-line elevator description ready *for after the test* — never before:
  > "It's a quiet Pomodoro timer with optional focus-sounds. I'm trying to build the calmest version of one."
