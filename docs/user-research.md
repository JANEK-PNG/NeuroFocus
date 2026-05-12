# Neurosync — Foundational User Research

_Senior research brief. Drafted 2026-05-12, post-refresh._
_Source files: `index.html` (live app), `Neurosync-Refresh-Pitch.html` (redesign brief), `mockup-calm.html` (visual reference)._

---

## 0. Framing

Neurosync is a focus timer that plays binaural / isochronic entrainment audio in a chosen brainwave band, layered with optional nature sounds and lo-fi radio, organised in Pomodoro-style rounds, with an optional programmed "journey" through bands and a brain-dump notes pad. Local-only, no account.

The v1 was visually built as a **scientific instrument** — JetBrains Mono everywhere, near-black bg, mint-cyan accent, five-band rainbow, hertz on the home screen, Windows-style mixer. The chairman's verdict was blunt: _"Looks like a website from 2010. The colors are for nerds."_ (`Neurosync-Refresh-Pitch.html` slide iii.) The refresh diagnosed this as the app being **accidentally designed for the engineer who built it** — not the person who'd actually open it for stress.

This document grounds the next phase: who is it _now_ for, what jobs does it do for them, where the market already serves them, and what we need to learn before we ship the next big swing.

---

## 1. Audience definition

### Who Neurosync is for

The redesign reorients toward what we'll call the **stressed-but-functional knowledge worker, age 26–44**, who:

- Works on a laptop for a living (designer, PM, marketer, writer, founder, consultant, researcher, therapist between sessions, grad student).
- Has _heard_ of binaural beats — probably from a TikTok, a Reddit thread, a friend, or a Spotify "deep focus" playlist — and is _curious_ rather than evangelical.
- Already uses _at least one_ of: Headspace, Calm, Endel, Brain.fm, Forest, a Pomodoro timer, a lo-fi YouTube tab.
- Wants their tools to look like a Le Labo candle, not a Bloomberg terminal.
- Treats focus as a wellness problem, not a productivity problem. The ask isn't _"help me ship more code"_ — it's _"help me stop feeling scattered."_
- Buys nice notebooks. Owns one set of decent headphones. Reads Cup of Jo / The Cut / Dense Discovery / Maeve newsletter.

### Who Neurosync is **not** for (anymore)

- **The biohacker / nootropics crowd.** They want hertz on screen, dosage controls, citations, and the rainbow. We have been making the app _for_ them by accident and they will be disappointed by the refresh. That's fine.
- **Hardcore productivity nerds (HN, r/productivity, Cal Newport disciples).** They want Notion-style density, keyboard shortcuts, a dashboard of streaks. Forest and a bare Pomodoro app already serve them.
- **Clinical users seeking therapy / treatment for ADHD, insomnia, anxiety disorders.** Anything we say that sounds like a medical claim is a regulatory problem. See Section 5.
- **Teenagers studying for exams.** Lofi Girl owns that audience, free, in a browser tab.
- **Power users wanting cloud sync, multi-device, sharing, social.** Not the product. Not yet, possibly not ever.

### Brand positioning sentence

> Neurosync is a calm timer for people who want their focus session to feel like a deep breath, not a workout. The entrainment audio is the engine; the experience is the product.

---

## 2. Personas — 3 primary

The personas are stylised but each is anchored to a behaviour pattern we'd expect to see in the wild. Each lives somewhere on the **calm ↔ productivity axis** — calm = "I want a spa moment", productivity = "I want monk-mode and a stack of finished tasks." Neurosync's centre of gravity should sit around 60% calm / 40% productivity.

### Persona A — Maya, 32, design lead at a Series-B SaaS

**Life context.** Lives in a one-bed in East London with her partner and a cat. Hybrid — three days in office, two from her kitchen table. She has 22 Figma files open, three Slack channels on fire, and a creeping sense that her thinking has become reactive rather than generative. She did a 10-day Vipassana retreat once and tells people about it more than she should.

**A day she'd open Neurosync.** Thursday, 09:40. She's just closed Slack after triaging overnight messages. She has 90 minutes before standup and she wants to make _meaningful progress_ on a redesign of the dashboard. Coffee is poured. She doesn't want music with lyrics. She doesn't want silence. She opens Neurosync, taps play, and the room softens.

**JTBD.**
- _When I sit down for deep design work, I want a soft sonic shell around me, so I can stop checking Slack and let my brain settle._
- _When I'm wired and anxious before a hard task, I want a five-second ritual that says "we're starting now", so I don't burn 20 minutes on doomscrolling first._
- _When I finish a focus block, I want a calm exit, so I don't crash into the next meeting feeling jangled._

**Anxieties / friction.** Will she look ridiculous to her partner if he sees "brainwave entrainment" on her screen? Is this pseudoscience? Will the audio be obnoxious in her good headphones? Does she have to learn what "theta" means before she can start? If yes — bounce.

**Success.** She finishes the session feeling like _she was present in it_. Not "I learned about brainwaves." Not "I shipped 4× more work." Just: _"I was in there. That felt like mine."_

**Axis.** Calm-leaning. ~70% calm / 30% productivity.

---

### Persona B — Daniel, 38, freelance copywriter & dad of two

**Life context.** Works from a converted shed at the bottom of the garden in Bristol. Has two kids under 7. His attention is shredded — not by his phone, by parenting and self-employment. He has clients who pay well and clients who email at 11pm. He buys tools that promise to give him back two hours a day and abandons most of them within a week.

**A day he'd open Neurosync.** Monday, 14:10. The kids are at school until 15:30. He has a long-form brand piece due Friday and he's procrastinated for three days. He's already had one coffee too many. He needs to _ride the wave of caffeine into work_, not crash into Twitter.

**JTBD.**
- _When I have a finite window before pickup, I want a timer that visibly counts me down, so I feel the urgency without feeling judged by it._
- _When I'm anxious about a deadline, I want background audio that masks both silence and household noise, so I can write without flinching at every car door._
- _When I keep getting tangled thoughts, I want somewhere to dump them quickly, so my brain doesn't keep cycling on "don't forget to call the dentist."_

**Anxieties / friction.** He's tried Brain.fm, Forest, Freedom, and three Pomodoro apps. He needs to trust this one is _different_ within 90 seconds or he closes the tab. He hates apps that make him sign up. He hates apps that try to sell him something on day one.

**Success.** He finishes one 50-minute block where he wrote 700 words without checking Twitter. He comes back tomorrow. The brain-dump pad has two notes in it — both of which he later acted on.

**Axis.** Mixed. ~50/50. He wants the calm aesthetic but he _needs_ output. The "round 2 of 4" structure is real value to him in a way it isn't to Maya.

---

### Persona C — Priya, 28, therapist-in-training & part-time barista

**Life context.** MSc in counselling psychology in Manchester. Works 18 hours/week at a third-wave café for income. Reads constantly, journals constantly, takes her own mental health seriously. Has anxiety, manages it well, is allergic to apps that promise to "optimise" her.

**A day she'd open Neurosync.** Sunday evening, 19:30. She has a 4,000-word essay due Wednesday and her brain has been mush all weekend. She doesn't want a stopwatch. She wants the room to feel like a library. She'll do one session, maybe two, then make dinner.

**JTBD.**
- _When I need to read dense academic material, I want a gentle audio bed that lowers my baseline arousal, so I can stay with one paragraph for more than 40 seconds._
- _When I'm wound up at the end of the day, I want a 10-minute session that isn't meditation, so I can reset without sitting cross-legged._
- _When I'm thinking about a client (or, later, a patient), I want a tool that doesn't make me feel like I'm being measured, so I can use it without it becoming a performance._

**Anxieties / friction.** Anything that smells of "biohacking", "neuro-optimisation", "10× your brain" is an instant uninstall. She is the audience most vulnerable to the v1 framing reading as _cringe_. The word "entrainment" might already lose her. "Brainwaves" she'll tolerate if the visuals are kind. Hertz on screen — gone.

**Success.** The app fades into her routine. She doesn't think about it. She just opens it before reading. She tells one friend about it casually, without a pitch.

**Axis.** Calm-dominant. ~85% calm / 15% productivity. The Pomodoro structure is almost incidental for her — she'd use a single open-ended session if we offered it (currently we don't; see research questions).

---

## 3. Competitive landscape — JTBD map

The honest competitive frame is not "other binaural beats apps." It's _"what is this person already doing in this moment instead?"_

| Competitor | Job they're hired for | What they do well | Where Neurosync has room |
|---|---|---|---|
| **Headspace** | "Teach me how to relax, in voice-guided 10-minute chunks." | Warm brand, celebrity voices, sleep stories, structured courses. The teacher metaphor. | Headspace asks you to _listen to a person_. Neurosync asks for nothing — no voice, no course. Lower social cost, lower commitment. |
| **Calm** | "Help me sleep / breathe / pause." | Premium production, dusk-blue mood, sleep-as-flagship. | Calm is for the _stopping_ moments. Neurosync is for the _starting_ moments — sitting down to actual work, not unwinding from it. |
| **One Sec** | "Add friction before I open Instagram." | Beautifully simple breath-gate before doomscroll. The verb is _breathe_. | One Sec is a defensive tool — it blocks. Neurosync is offensive — it _produces_ a session. Could integrate philosophically: "neurosync as the long-form sibling of one sec." |
| **Endel** | "Soundtrack my mood, adaptively, all day." | Generative audio, smart context (time, weather, heart-rate). The flagship is _sound_. | Endel is ambient, continuous, sometimes vague. Neurosync has a _shape_ — start, middle, end, rounds. Better for finite tasks. |
| **Brain.fm** | "Functional music with scientific credibility for focus, sleep, relax." | The closest direct competitor in audio-for-focus. Has clinical-feeling positioning. | Brain.fm leans hard on the science marketing — _their_ user is closer to v1 Neurosync's accidental audience. Neurosync v2 should lean _calmer_, not duel them on credentials. Their gap = warmth. |
| **Forest** | "Shame me out of touching my phone." | Streaks, social, the trees-as-investment metaphor. Gamification done well. | Forest is _punitive_ at heart. Neurosync is _hospitable_. Different emotional vocabulary. |
| **A bare Pomodoro app (Be Focused, Pomofocus, etc.)** | "Give me a 25/5 timer with a ding." | Free, fast, zero learning curve. | Bare Pomodoro is silent. Neurosync is the same _structure_ plus an audio bed plus an exit ritual. The audio is the differentiator. |
| **YouTube "lofi girl" + Spotify focus playlists** | "Give me a tab of background music that says 'I'm working now.'" | Free, infinite, lyric-free, _social proof at scale_. | This is the **real competitor for 80% of the target audience.** Lofi already owns the audio-bed slot. Neurosync's advantage is _intentionality_ — a beginning and an end, a round count, no random Cardi B feature, no algorithmic creep. We have to win the open-the-app moment from a tab that's already pinned. |

### The sharpest competitive gap

**Nobody owns "the calm Pomodoro."** Headspace is voice. Calm is sleep. Brain.fm is clinical. Endel is ambient. Forest is shame. Lofi Girl is wallpaper. There is no app whose answer to _"I'm sitting down to do hard work, please make this gentle"_ is the obvious one. That's the seat. The audio engine is the moat; the calm aesthetic is the entry ticket; the round structure is the spine.

---

## 4. Key research questions

Phrased as questions, not hypotheses. Grouped by funnel stage.

### Acquisition

- What words does the target audience use for the feeling Neurosync solves? ("Scattered"? "Wired"? "Can't get started"? "Brain fog"?) The marketing copy should mirror their words, not ours.
- Where do they first hear about apps in this category — TikTok, friend, podcast, App Store browse, search? Different channels imply different first-impression demands.
- When they hear "binaural beats," what's their default association — _woo_ or _curious_? Does the answer shift by age, gender, education?
- Would they pay? At what price? Monthly or one-time? Is there a "purchase once and have it forever" instinct given how often these apps churn?
- Does Neurosync need a name change to escape the "neuro-" prefix's biohacker baggage, or does the new visual language carry the audience over?

### First-run

- Do users understand what the app does within 10 seconds of first load, without reading any text? (The redesign moves to "time + play" — does that succeed on its own?)
- Do they tap _play_ before opening the drawer? If yes, the calm-screen bet is working. If no, they're hunting for explanation.
- When they open the drawer for the first time, which tab do they go to first — _sound_, _presets_, _journey_, or _notes_? Order matters; we may be putting the wrong tab first.
- Does a first-time user finish a full 25-minute round? Or do they abandon mid-session — and at what minute mark?
- Does the brain-dump pad get used in session one, or only on day three or later?
- Does the breathing-ring animation around the play button (`@keyframes breathe` in `index.html`) read as _calming_ or _trying too hard_?

### Habit loop

- Day-2 return rate: of users who finish a session on day 1, how many come back the next day? (Industry benchmark for wellness apps is ~25–35% day-2; below 20% is a problem.)
- Day-7 retention: what fraction of D1 finishers run at least one session in the next week?
- Day-30 retention: who's still here? What's different about them — persona type, session length preference, journey use?
- What's the natural session cadence — once a day, multiple times a day, only on hard work days, only Sunday-prep nights?
- Do users develop a "favourite preset" within the first three sessions, or do they keep tweaking? Settling = good signal.
- Does the notes pad become a sticky feature in its own right, or is it ignored?

### The audio claim

- Do users _believe_ the entrainment is doing something, after one session? After ten?
- Does belief correlate with reported focus quality, independent of actual effect? (If yes, we are partly in the placebo business — and that's fine, but it changes how we frame.)
- Are isochronic tones tolerated as well as binaural? Headphones vs. speakers — does the product still work without good headphones?
- What does a user notice _first_ when the audio is wrong — the entrainment tone or the nature/radio layer? (Implication for mixer defaults.)
- Does removing the on-screen Hz reading reduce credibility, or increase it (less clinical, more trusted)?

### The "brainwave" framing

- Does the word _brainwave_ on the marketing site help or hurt with each of our three personas? (Hypothesis: helps Daniel, neutral for Maya, hurts Priya. Worth testing.)
- Does hiding the band names behind the drawer feel like _polish_ or _withholding information_?
- Would a "Journey" feel more inviting if the bands were named in plain English (_"settle → deepen → return"_) rather than _alpha → theta → beta_?
- Is _"calm focus app with optional brainwave audio"_ a better top-line than _"brainwave entrainment focus timer"_?
- How does the audience feel about a "science" panel that exists but is one tap away — present for those who want it, invisible for those who don't?

---

## 5. Sensitivities & risks

### Medical / regulatory

Binaural beats and isochronic tones have a thin, mixed evidence base. Some peer-reviewed studies show modest effects on anxiety, attention, or mood; others are null. **Neurosync must not make therapeutic claims.** Phrases to retire from any future copy:

- "Treats anxiety / ADHD / insomnia."
- "Clinically proven."
- "Neurofeedback" (this is a regulated term in some jurisdictions).
- "Reduces cortisol." (Unless we ourselves measure it — we don't.)

Phrases that are safe and still resonant:

- "Designed to support focus."
- "Many people find this helpful when…"
- "A gentle audio bed for the work."
- "Inspired by research on auditory entrainment."

The app should ship with a brief, plain-language honesty page: _"What this is, what it isn't, what science we trust, what's still uncertain."_ Done right, this becomes a trust artefact rather than a disclaimer.

### Pseudoscience perception risk

The audience we want — Maya and Priya in particular — are wellness-literate, which means they're also _wellness-skeptical_. They have a finely-tuned cringe detector for anything that smells like Goop, "scalar energy," or crypto-bro biohacking. The v1 rainbow + neon mint + "10 HZ ALPHA" headline read as the _bad_ kind of techno-spiritual.

The refresh's defence is paradoxical: **the calmer it looks, the more credible it becomes.** Less science theatre = more actual scientific trust. Brain.fm's loud "neuroscience-backed" positioning is a cautionary tale: the people most loyal to it are the people we're trying _not_ to over-index on.

### Accessibility

- **Audio-only signal.** Hearing-impaired users currently get almost nothing. The Pomodoro structure, the breathing-ring visual, and the notes pad are usable; the entrainment audio is the whole point. Worth at minimum: a "visual session" mode that pulses the gradient in time with the band frequency, so the experience has a non-auditory anchor.
- **Noise-sensitive / sensory-sensitive users (autistic adults, ADHD users on meds, migraine-prone users).** Binaural tones can be intolerable for some. Need: a quick "test the tone" preview before committing to a 25-min session. Need: a single global "tone off, ambience only" mode that still feels like a complete product, not a degraded one.
- **Reduced-motion users.** Already partly handled — `@media (prefers-reduced-motion: reduce)` disables the breathing and drift animations in `index.html`. Good. Audit before each release.
- **Colour contrast.** The light theme on `--paper #F4EFE6` with `--ink-muted #8A7F70` is at the boundary of WCAG AA for small text. Re-test after any palette tweak.
- **Screen reader.** The current calm screen leans on a giant time numeral and a single play button. Announce session state (round number, time remaining, band) accessibly when the play button is activated. Don't assume the user can see the gradient breathing.

### Cultural

Focus and meditation apps as a category skew **white, Western, cis, middle-class, neurotypical** in their visual language, voice talent, and "ideal user" imagery. Neurosync currently has no people in the UI — which is a temporary protection, but won't last past the marketing site. Things to think about before scaling:

- If we add voice prompts, whose voice? One voice is a positioning choice; many voices is an inclusion choice.
- If we add testimonials or case-study photography, audit for the same monoculture trap Headspace fell into for years.
- The serif typography (Fraunces / Cormorant) carries a "good taste, Brooklyn, Daunt Books" connotation. That's the current vibe and it's deliberate — but be aware it's also a class signal.
- Audio "wellness" as a category was built largely on appropriated Eastern contemplative traditions. Neurosync mostly avoids this by leaning Western-secular-clinical, but if we ever add features like _"meditation"_, _"chakras"_, _"mantras"_, the bar for cultural care goes way up.

---

## 6. Recommended next research moves

A cheap-to-expensive ladder. Run them in order; let each one's findings shape the next.

### Tier 1 — this week, cheap

1. **5-user guerrilla test on the calm screen (cost: ~£0–£50).** Recruit five people from outside the build team — ideally one designer, one parent, one student, one skeptic, one biohacker. Show them the calm screen in `index.html` on a phone for 30 seconds with zero context. Ask: _"What is this? What do you think it does? Would you tap anything?"_ Then ask them to start a session and narrate. Look for: confusion at the time numeral (good if absent), drawer discovery (do they find the handle?), reaction to the breathing ring (calming vs. distracting), reaction to the band names if they open the sound tab.
2. **Read-aloud copy audit (cost: 1 designer-day).** Have every word currently in the UI read aloud to one of the three personas (proxies are fine). Note where they wince, ask what something means, or paraphrase incorrectly. _"Entrainment"_, _"isochronic"_, _"journey"_, _"deepwork"_ are the prime suspects.
3. **Quick competitive teardown (cost: 1 researcher-day).** Time-on-task for the same job ("start a 25-min focus session") across Neurosync, Brain.fm, Endel, a bare Pomodoro app, and a YouTube lofi tab. Capture screenshots of the first three taps. Where are we slower? Where do we win on _feel_? Where do we lose on _trust_?

### Tier 2 — next two weeks, moderate

4. **Belief-and-effect survey (cost: ~£200 on Prolific, n=80–120).** Two arms: half see Neurosync framed as _"calm focus timer with gentle audio"_, half see it framed as _"brainwave entrainment for focus."_ Measure: intent to use, perceived credibility, perceived efficacy, expected stickiness. Critical: does the entrainment language _help_ or _hurt_ acquisition? This single test changes the home page copy.
5. **First-session funnel instrumentation (cost: 2 dev-days, then ongoing).** Local-only is a constraint but we can instrument anonymously with user consent on a hosted variant. Track: home-screen-to-play time, drawer opens, first round completion, second round started, brain-dump used.

### Tier 3 — month-long

6. **Diary study, 2 weeks, n=8 (cost: ~£800 incentives + analysis time).** Mix of personas. Daily prompt: _"Did you use Neurosync today? Yes / No. If yes — when, why, did you finish, how do you feel right now in one sentence?"_ Two short interviews per participant: kickoff and wrap. Output: the real shape of the habit, including the gaps — the days they didn't open it and what was happening instead.
7. **Comparative A/B test of "calm" vs "productivity" framing on the landing/marketing page (cost: ad spend + landing-page variants).** Two ads, two landing pages, same product behind both. Same call-to-action ("open the app"). Measure: click-through, app-open, first-session completion. Tells us which persona the marketing should lead with — and gives us permission to specialise.

### Tier 4 — quarter-long, if signals warrant

8. **Light efficacy study (cost: meaningful — £5k+ for a clean within-subject design with n=30).** Self-reported focus and calm pre/post session, randomised between entrainment-on and entrainment-off (ambience-only) conditions. Even a small effect with proper methodology would let us move from "many people find this helpful" to "in our internal study, X% of users reported…" — a one-grade credibility upgrade.

---

## Appendix — what we already know from the artefacts

- **Confirmed features (from `index.html`):** Pomodoro timer with configurable rounds and break length; five bands (delta/theta/alpha/beta/gamma) with descriptions and "when to use" copy already written; four journey types (manual, deepwork, creative, study); audio mixer with three layers (entrainment, nature, radio); presets for session length; notes tab; light/dark theme; reduced-motion handling; local-only persistence.
- **Confirmed design direction (from `Neurosync-Refresh-Pitch.html` slides vii–viii):** Light-default warm off-white. Soft chromatic gradient washes. One sans (Manrope) + one humanist serif (Fraunces). Big calm numerals, almost no labels. One visible action. Organic motion (breath, drift) over neon glow.
- **Confirmed competitor reference set (from the pitch moodboard, slide vii):** Opal, One Sec, Headspace, Calm, Endel. Brain.fm, Forest, and Lofi Girl are notable _omissions_ from the pitch — they are added in this research doc because they are honest competitors for the same minute of attention.

---

_End of document. Next read: see Tier 1 recommendations and pick one to run this week._
