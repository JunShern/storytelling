// Compiles content/stories/*.md into the static data the site consumes:
//   site/public/data/index.json          — metadata for every story (small)
//   site/public/data/stories/<id>.json   — full text, facts, sources (lazy-loaded)
// Runs automatically before `npm run dev` and `npm run build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..", "..");
const STORIES_DIR = path.join(ROOT, "content", "stories");
const OUT_DIR = path.join(ROOT, "site", "public", "data");
const INTRO_HEADING = "## Before we begin";
const STORY_HEADING = "## The story";
const FACTS_HEADING = "## What's true in this story";

function parseStory(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  const meta = YAML.parse(match[1]);
  const rest = match[2].trim();

  const factsAt = rest.indexOf(FACTS_HEADING);
  let body = (factsAt === -1 ? rest : rest.slice(0, factsAt)).trim();
  const facts =
    factsAt === -1
      ? []
      : rest
          .slice(factsAt + FACTS_HEADING.length)
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.startsWith("- "))
          .map((l) => l.slice(2).trim());

  // v2 stories carry a "Before we begin" intro ahead of "The story";
  // v1 stories have neither heading and the whole body is the story.
  let intro = "";
  const storyAt = body.indexOf(STORY_HEADING);
  if (storyAt !== -1) {
    const before = body.slice(0, storyAt);
    const introAt = before.indexOf(INTRO_HEADING);
    if (introAt !== -1) intro = before.slice(introAt + INTRO_HEADING.length).trim();
    body = body.slice(storyAt + STORY_HEADING.length).trim();
  }

  const words = body.split(/\s+/).length + (intro ? intro.split(/\s+/).length : 0);
  return {
    meta: {
      id: meta.id,
      title: meta.title,
      place: meta.place,
      time: meta.time,
      event: meta.event,
      reading_time_minutes: meta.reading_time_minutes ?? Math.round(words / 140),
      words,
    },
    full: {
      id: meta.id,
      title: meta.title,
      place: meta.place,
      time: meta.time,
      intro,
      body,
      facts,
      sources: meta.sources ?? [],
      generation: meta.generation ?? null,
    },
  };
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT_DIR, "stories"), { recursive: true });

const files = fs.existsSync(STORIES_DIR)
  ? fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".md")).sort()
  : [];

const index = [];
for (const f of files) {
  const { meta, full } = parseStory(path.join(STORIES_DIR, f));
  index.push(meta);
  fs.writeFileSync(path.join(OUT_DIR, "stories", `${meta.id}.json`), JSON.stringify(full));
}
index.sort((a, b) => a.time.year - b.time.year);
fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index, null, 1));
console.log(`build-content: ${index.length} stories -> ${path.relative(ROOT, OUT_DIR)}`);
