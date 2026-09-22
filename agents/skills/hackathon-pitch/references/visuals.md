# Visuals on a pitch slide

Condensed from `content-infographic`, `content-diagramming` and `diagram-design`, cut down
to what a 3–10 minute pitch actually needs.

## Pick the right object

| What you want to show | Use | Template slide |
|---|---|---|
| The product working | Screenshot, or a recorded clip's key frame | 93, 179 (MacBook), 177/178 (iPhone), 180 (iPad) |
| How the pieces fit together | One architecture diagram, ≤ 9 boxes | 91 (image right), 90 (full bleed) |
| A sequence of steps | 3–4 column layout with arrows in the words, not a flow chart | 67, 81 |
| One number that matters | Stat slide, number as hero | 158, 160–164 |
| A comparison of two states | From → to | 69, 70 |
| A trend over time | Line or bar chart with the template's own chart slides | 136, 117, 124 |
| Effort vs value of options | Prioritisation matrix | 152 |

**A screenshot beats a diagram. A diagram beats an icon. An icon beats stock
photography — and stock photography of people at laptops is banned outright.**

## Diagrams

Target density **4/10**: technically complete, no legend needed. Above nine nodes it is two
diagrams, or it is a slide nobody reads in five seconds.

- Every box is a distinct idea. Two boxes that always travel together are one box.
- Every arrow carries information. If the relationship is obvious from the layout, drop the
  line.
- One accent colour, on one or two focal nodes. Accenture purple `#A100FF` for the thing
  you built; neutrals for everything that already existed. That single contrast is usually
  the whole message: *this part is ours*.
- Flow left→right or top→bottom, never both in one diagram.
- Label the arrows with the payload ("CRQ + allegati"), not with verbs ("invia").

Production path: draw it as SVG or HTML, render to PNG (a browser screenshot is fine), then
place it with `deck_image.py`. Do not rebuild it with PowerPoint autoshapes — it will not
survive the first edit.

## Charts

- The title states the finding, not the axis: *"Il 70% del tempo è attesa, non lavoro"*,
  not *"Distribuzione del tempo"*.
- Bar axes start at zero. Pie charts get at most five segments; beyond that use a bar.
- Annotate the one value that matters directly on the chart; then you can delete the legend.
- Maximum two series on a pitch slide.
- Colours come from the brand tokens only (`brand-rules.md` §6): purples for your data,
  neutral grey for the baseline, pink `#FF50A0` reserved for warnings.
- The template's chart slides hold embedded Excel data — editing them means editing the
  chart in PowerPoint. For a hackathon, rendering the chart outside and placing it as an
  image is usually faster and always more controllable.

## Screenshots

- Crop to the region that proves the claim. A full desktop with a browser chrome and a
  taskbar proves nothing.
- Blur or replace real names, tickets and client data. Every hackathon deck gets forwarded.
- If the UI is ugly, say so and move on — juries score the working thing, not the CSS. If
  the UI is good, give it a full slide.
- One screenshot per slide. Two screenshots are two slides.

## Accessibility and the room

- Body text on a slide: never below 14 pt. Captions and sources 10–12 pt, and only for
  sources.
- Assume the projector crushes contrast: mid-grey on white disappears. Use the token
  neutrals and purples, not custom tints.
- Do not encode meaning in colour alone — label the series.
