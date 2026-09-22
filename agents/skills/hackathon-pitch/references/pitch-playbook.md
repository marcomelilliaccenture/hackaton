# Pitch playbook — how an idea wins a hackathon jury

Read before writing the narrative. Sources at the bottom; the guidance is the intersection
of corporate-hackathon judging practice, demo-day pitch craft, and what survives a 3-minute
slot.

---

## 1. What juries actually score

Corporate innovation hackathons converge on four dimensions. Weights vary; the order rarely
does.

| Dimension | The question behind it | What earns the point |
|---|---|---|
| **Impact / business value** | Who is better off, by how much? | A named user, a measured baseline, a plausible delta |
| **Feasibility / execution** | Could this exist here, with our constraints? | A working demo, a real integration, honest limits |
| **Innovation** | Is this a new way to solve it, or a known tool re-badged? | The insight nobody else had, stated in one sentence |
| **Fit to the theme** | Did they answer the brief? | The organiser's own words, used on the cover |

Secondary but common: scalability (does it survive outside the demo case), team/execution
credibility, quality of the presentation itself.

Two consequences:

- **Feasibility and impact usually outweigh technical ambition.** A small thing that works
  and has a believable adoption path beats an ambitious thing that only exists on a slide.
- **Build the deck against the published rubric.** If the organiser lists criteria, mirror
  their order and vocabulary. A judge scoring a form finds each answer where they expect it.

## 2. The clock

A pitch is a time budget, not a page count. Two standard slots:

**3 minutes — 6 to 8 slides**

| Time | Beat | Slides |
|---|---|---|
| 0:00–0:25 | Hook: the cost of today, as one number or one scene | 1 |
| 0:25–0:50 | Who suffers, how often | 1 |
| 0:50–1:15 | The idea in one sentence + the insight | 1 |
| 1:15–2:00 | Demo — the thing running | 1–2 |
| 2:00–2:30 | Impact, with the baseline it is measured against | 1 |
| 2:30–3:00 | Feasibility + what happens Monday + the ask | 1–2 |

**5 minutes — 9 to 12 slides.** Same spine, with room for: why now, why us, the one
architectural choice worth defending, and a 12-week path. Never room for: an agenda, a
market-size digression, a team-bio slide before the demo.

Rehearse with a timer. Over time is not a delivery problem, it is a content problem: cut a
slide.

## 3. The narrative spine

```
HOOK → PROBLEM → INSIGHT → SOLUTION → DEMO → IMPACT → FEASIBILITY → ASK
```

- **Hook.** A number, a scene, or a sentence a judge can repeat in the deliberation room.
  Not a greeting, not your names, not the agenda. If the deck has one memorable sentence,
  it lives here and comes back at the close.
- **Problem.** Specific, owned by someone real, sized. "Il team X processa 120 richieste a
  settimana, 40 minuti l'una" beats "i processi manuali sono inefficienti".
- **Insight.** Why this problem is still unsolved, and what you saw that changes it. This is
  the innovation score in one sentence. Without it the pitch sounds like a tool demo.
- **Solution.** What it is, in the user's language, in one sentence. Then how it works, in
  at most three moves. No feature list.
- **Demo.** See §4. This is the feasibility score.
- **Impact.** Baseline → delta → what it unlocks. Every number sourced inline. Ranges, not
  single-point projections.
- **Feasibility.** The honest slide: what is real today, what is mocked, what it would take
  to run in production, what could kill it. Juries reward teams that name their own risks;
  they punish the ones they have to uncover in Q&A.
- **Ask.** One thing. A sponsor, a pilot team, two weeks of engineering, access to a
  dataset. "Grazie" is not an ask.

## 4. Demo strategy

The demo is the single highest-value 45 seconds in the pitch.

- **Record it.** A clean 30–60 second screen capture with no dead time, cut to the moment
  that matters. Networks fail, laptops sleep, shared screens resize.
- **Keep the live version as an encore**, not as the plan. If the jury asks, run it.
- **Show the outcome, not the plumbing.** One user, one task, start to finish. No login
  screens, no config, no "and here's the admin panel".
- **Narrate what the judge should notice**: "questo passaggio prima richiedeva 40 minuti".
- **Be explicit about what is mocked.** Say it before they find it. "Il classificatore è
  reale, l'integrazione con ServiceNow è simulata" costs three seconds and buys the
  feasibility score.

## 5. Slide craft

- **One idea per slide.** If you need "and" to describe it, split it.
- **Five-second rule.** A judge glancing at a slide must get its message in five seconds.
  Headline states the message ("Il triage scende da 40 a 6 minuti"), not the topic
  ("Risultati").
- **Max ~30 words of body text.** The slide holds the claim; you hold the explanation.
- **Numbers as heroes.** One big number, one line of context, the source underneath.
- **Screenshot > diagram > icon > stock photo.** Stock photography costs credibility.
- **No agenda slide, no thank-you slide, no "Questions?" slide.** Backup slides live after
  the closer, unnumbered in the spoken flow.
- **Speaker notes carry the talk**: what to say, the timing mark, the transition sentence.

## 6. Delivery

- Open on the hook, standing still. Names come after the hook, in five words, or not at all.
- One speaker owns the spine; a second speaker may own the demo. More than two hand-offs in
  three minutes reads as a relay race.
- Say the transition out loud ("quindi il problema è il tempo, ora guardiamo cosa abbiamo
  costruito") — judges follow structure they can hear.
- Land the last sentence and stop. Do not trail into "sì, ecco, questo è tutto".

## 7. Anti-patterns

| Pattern | Why it costs points | Instead |
|---|---|---|
| Agenda slide | Nobody scores your outline | Start with the hook |
| Problem stated in the abstract | Unfalsifiable, unscoreable | One user, one number |
| Feature list | Reads as unfinished thinking | Three moves, one sentence each |
| Live demo with no backup | One network hiccup ends the pitch | Recorded clip, live on request |
| Wall of text | The judge reads instead of listening | Headline + speaker notes |
| Unsourced numbers | Trained juries stop trusting the deck | `(fonte: …)` under the number |
| Single-point projection ("-30% costi") | Reads as overconfident | Range + named assumption |
| Hiding what is mocked | Discovered in Q&A, costs double | Declare it on the feasibility slide |
| "Grazie / Domande?" as the final slide | Wastes the last impression | Repeat the hook, state the ask |
| Team bios before the demo | Credibility comes from the working thing | Team after the ask, if at all |

## 8. Q&A preparation

Prepare answers, and a backup slide each, for the six questions that come up in almost every
jury:

1. What exactly is working today, and what did you mock?
2. What would it take to put this in production here?
3. Why hasn't someone solved this already?
4. What happens when the data / volume / edge case is ten times bigger?
5. Who owns this after the hackathon, and what do you need from us?
6. What is your estimate based on?

Rules: answer in one sentence, then stop. "Non lo sappiamo ancora, lo misureremmo così" is a
strong answer. Inventing a number in Q&A undoes the whole pitch.

---

## Sources

- [How to Build a Hackathon Pitch Deck: 5-Minute Structure — hacktribe](https://hacktribe.co/blog/how-to-build-a-hackathon-pitch-deck-practical-5-minute-structure)
- [Hackathon judging: 6 criteria to pick winning projects — TAIKAI](https://taikai.network/en/blog/hackathon-judging)
- [A guide to crafting an effective hackathon judging framework — Mercer | Mettl](https://blog.mettl.com/hackathon-judging-criteria/)
- [Corporate Hackathon Guide, 7 steps from a Microsoft & Accenture veteran — Innovation Mode](https://theinnovationmode.com/the-innovation-blog/how-to-run-a-successful-corporate-hackathon)
- [How to design a better pitch deck — Y Combinator](https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck)
- [Creating a 5-minute kickass hackathon pitch — Circles.Life](https://medium.com/circleslife/creating-a-5-minute-kickass-hackathon-pitch-17cdcb42c3bc)
- [How to Make a Presentation for a Hackathon — SlideModel](https://slidemodel.com/hackathon-presentation/)
- [12 common investor pitch deck mistakes — Benjamin Ball Associates](https://benjaminball.com/blog/investor-presentation-pitch-deck-mistakes/)
