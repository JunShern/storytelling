# Writing prompt — v3

Changes from v2: shorter. Stories now target a 3–8 minute read-aloud instead of
5–10 — read-aloud fatigue is real. Everything else — the "Before we begin"
intro, the plot arc, the dialogue, the range of moods — carries over from v2.

You are writing an educational bedtime story for a website of historical bedtime
stories. The stories are read aloud in bed — by adults to each other, and plausibly
by parents to children. Follow this brief and the researched fact sheet exactly.

## The brief

Place: {{place_name}} ({{time_display}}, {{era}})
Event: {{event}}

## The fact sheet (your only source of facts)

{{fact_sheet}}

## What the story must be

- **An introduction first.** Before the story, write a "Before we begin" section
  of roughly 50–100 words — about twenty-five seconds read aloud, in a warm,
  conversational voice, addressed to the listener. It must: (a) place the
  setting in modern terms ("the city we now call...", "in the country now
  known as..."), (b) say when the story happens in a way a listener can anchor
  ("more than a thousand years ago", "around the time that..."), and (c) teach
  the 3–6 unfamiliar names and terms the story uses — with a simple
  pronunciation guide in parentheses and a few words of meaning — so no one is
  pulled out of the story later to have something explained. Do not summarize
  the plot.
- **Length:** 550–900 words for the story itself (the introduction is on top
  of this) — a 3–8 minute read-aloud at a gentle pace. Shorter is fine;
  a tight story beats a padded one. Cut secondary detail before cutting
  dialogue or the arc, and keep the handful of facts a listener will
  remember tomorrow.
- **A real arc.** The protagonist should want something or face a problem near
  the beginning; the middle should build — an obstacle, a worry, a race, a
  search; the ending should resolve it. Small stakes, honestly felt, are
  better than world-sized stakes. The reader should be able to say afterward
  what happened, not only what it was like.
- **Dialogue.** A substantial part of the story should be characters speaking
  with each other — questions, teasing, comfort, instruction. Let facts arrive
  through conversation and action rather than narration wherever possible.
  Give each speaker a voice.
- **Mood: whatever the history calls for.** These are bedtime stories, but not
  every page must be serene. Excitement, suspense, awe, gentle sadness, and
  humor are all welcome when they fit the era and the perspective — a fire is
  frightening, a flood brings loss, a landfall brings joy. Two limits hold:
  no graphic violence or cruelty on-page, and the ending must land settled and
  safe — the listener should be able to close their eyes afterward. Night
  falling or someone going to sleep remains a lovely way out, but is not
  required.
- **Register:** written like a children's story — concrete images, a small
  cast — but never condescending. The best test: a tired adult should enjoy
  it as much as a child.
- **Protagonist:** invent a small, ordinary point-of-view character (a child,
  an apprentice, a helper) through whose eyes we see the real place and time.
  Never a famous historical figure as protagonist — famous figures may appear
  at a respectful distance, doing things the record supports.
- **Educational:** the story must vividly and accurately convey the key facts
  from the fact sheet — woven into scene and dialogue, never listed. Prefer
  facts a reader will remember tomorrow: numbers, names, sensory details, and
  the deeper "how the world worked" truths of the era.
- **Honest:** nothing in the story may contradict the fact sheet. Do not repeat
  any of the listed misconceptions. Where the record is uncertain, stay vague
  rather than inventing specifics.
- **A quiet theme:** beneath the plot, let one gentle universal truth surface —
  curiosity, patience, courage, care for others — the kind of thing adults
  hear even when children just hear the story.
- **Read-aloud friendly:** avoid names and words that are hard to pronounce
  without help; anything unavoidable belongs in the introduction with its
  pronunciation.

## Output format

Return a complete Markdown file in exactly this shape (frontmatter included,
nothing before or after it):

```markdown
---
id: {{id}}
title: <an evocative title>
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
reading_time_minutes: <(story words + intro words) / 140, rounded>
generation:
  model: {{model}}
  prompts: {{prompt_version}}
  date: {{date}}
  method: {{method}}
sources:
  - <url>
  - <url>
---

## Before we begin

<the introduction, as described above>

## The story

<the story text, in paragraphs with dialogue, no further headings>

## What's true in this story

<6–10 short bullet points separating fact from fiction: which characters are
invented, which people/places/numbers/details are real, with dates. Written
warmly, for the curious reader who just finished the story.>
```
