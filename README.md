# Bedtime Histories

Educational bedtime stories set in real historical places and times, presented on an
interactive world map + timeline. Each story is a 5–10 minute read-aloud: calm and
gentle enough for a child, factual and layered enough for adults.

**Live site:** https://junshern.github.io/storytelling/

## How it's organized

```
content/
  briefs/      Story briefs — the catalog of (place, time, event) entries.
               Adding stories at scale = adding briefs here.
  stories/     Finished stories as Markdown with YAML frontmatter.
               Fully self-describing: place, time, sources, generation metadata.
pipeline/      Standalone story-generation CLI (research → write), independent
               of the site. Versioned prompts, swappable models.
site/          The static website (Svelte + Vite). Compiles content/stories
               into a lightweight index; story text lazy-loads per story.
.github/       GitHub Actions workflow that builds and deploys to GitHub Pages.
```

## The content model

A **brief** describes a story that should exist:

```yaml
# content/briefs/edo-firefighters.yaml
id: edo-firefighters
place:
  name: Edo (Tokyo)
  lat: 35.69
  lng: 139.69
  highlight: ["392"]        # ISO numeric country ids to light up on the map
time:
  year: 1700
  display: c. 1700 CE
  era: Edo Period
event: >
  Genroku-era Edo — the world's largest city: sankin-kotai, hikeshi
  firefighters, terakoya schools, ukiyo-e, street food.
```

A **story** is the brief plus the finished text, research sources, and generation
metadata (model, prompt version, date). See `content/stories/*.md` for the format.
Because every story records how it was generated, regenerating the whole library
with a better model or prompt is just re-running the pipeline over the briefs.

## Writing new stories

Two supported paths, both using the same brief → research → write structure:

1. **Claude session** (how the first six were written): give Claude the brief and
   the prompt templates in `pipeline/prompts/`, have it research with web search
   and write the story file directly.
2. **Pipeline CLI** (for batch generation):

   ```bash
   cd pipeline
   npm install
   export ANTHROPIC_API_KEY=sk-ant-...
   node src/generate.js --brief ../content/briefs/edo-firefighters.yaml
   node src/generate.js --all                 # generate every brief without a story
   node src/generate.js --all --force         # regenerate everything
   node src/generate.js --brief ... --model claude-sonnet-5 --prompts v1
   ```

## Running the site locally

```bash
cd site
npm install
npm run dev
```

The dev server rebuilds the story index automatically when content changes.

## Deploying

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`.
(Enable Pages with "GitHub Actions" as the source in repo settings, once.)
