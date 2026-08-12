# Writing prompt — v1

You are writing an educational bedtime story for a website of historical bedtime
stories. The stories are read aloud in bed — by adults to each other, and plausibly
by parents to children. Follow this brief and the researched fact sheet exactly.

## The brief

Place: {{place_name}} ({{time_display}}, {{era}})
Event: {{event}}

## The fact sheet (your only source of facts)

{{fact_sheet}}

## What the story must be

- **Length:** 900–1,200 words — a 5–10 minute read-aloud at a gentle pace.
- **Tone:** calm, warm, and quieting. This is a story someone reads in bed at the
  end of the day. No violence on-page, no dread, no cliffhangers. It should end
  softly, ideally with night falling or someone going to sleep.
- **Register:** written like a children's story — simple sentences, concrete
  images, a small cast — but never condescending. The best test: a tired adult
  should enjoy it as much as a child.
- **Protagonist:** invent a small, ordinary point-of-view character (a child,
  an apprentice, a helper) through whose eyes we see the real place and time.
  Never a famous historical figure as protagonist — famous figures may appear
  at a respectful distance, doing things the record supports.
- **Educational:** the story must vividly and accurately convey the key facts
  from the fact sheet — woven into the story, never listed. Prefer facts a
  reader will remember tomorrow: numbers, names, sensory details, and the
  deeper "how the world worked" truths of the era.
- **Honest:** nothing in the story may contradict the fact sheet. Do not repeat
  any of the listed misconceptions. Where the record is uncertain, stay vague
  rather than inventing specifics.
- **A quiet theme:** beneath the facts, let one gentle universal truth surface —
  curiosity, patience, care for others, the smallness and connectedness of
  people — the kind of thing adults hear even when children just hear the story.
- **Read-aloud friendly:** avoid names and words that are hard to pronounce
  without help; where an unfamiliar word is essential, let the story itself
  teach how to say or understand it.

## Output format

Return a complete Markdown file in exactly this shape (frontmatter included,
nothing before or after it):

```markdown
---
id: {{id}}
title: <an evocative, gentle title>
place:
  name: {{place_name}}
  modern_country: {{modern_country}}
  lat: {{lat}}
  lng: {{lng}}
  highlight: {{highlight}}
time:
  year: {{year}}
  display: {{time_display}}
  era: {{era}}
event: <one-sentence summary of the historical event/setting>
reading_time_minutes: <words / 140, rounded>
generation:
  model: {{model}}
  prompts: {{prompt_version}}
  date: {{date}}
  method: {{method}}
sources:
  - <url>
  - <url>
---

<the story text, in paragraphs, with no headings>

## What's true in this story

<6–10 short bullet points separating fact from fiction: which characters are
invented, which people/places/numbers/details are real, with dates. Written
warmly, for the curious reader who just finished the story.>
```
