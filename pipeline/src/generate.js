#!/usr/bin/env node
// Story generation pipeline: brief -> research -> write -> content/stories/<id>.md
//
// Usage:
//   node src/generate.js --brief ../content/briefs/edo-city-of-a-million.yaml
//   node src/generate.js --all              # every brief that has no story yet
//   node src/generate.js --all --force      # regenerate everything
//   node src/generate.js --brief ... --model claude-sonnet-5 --prompts v2
//
// Requires ANTHROPIC_API_KEY (or an `ant auth login` profile).

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..", "..");
const BRIEFS_DIR = path.join(ROOT, "content", "briefs");
const STORIES_DIR = path.join(ROOT, "content", "stories");
const PROMPTS_DIR = path.join(ROOT, "pipeline", "prompts");

function parseArgs(argv) {
  const args = { model: "claude-opus-5", prompts: "v1", all: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--brief") args.brief = argv[++i];
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--prompts") args.prompts = argv[++i];
    else if (a === "--all") args.all = true;
    else if (a === "--force") args.force = true;
    else if (a === "--help" || a === "-h") {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 10).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
      process.exit(0);
    } else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Missing template variable: ${key}`);
    return String(vars[key]);
  });
}

function briefVars(brief) {
  return {
    id: brief.id,
    place_name: brief.place.name,
    modern_country: brief.place.modern_country ?? "null",
    lat: brief.place.lat,
    lng: brief.place.lng,
    highlight: JSON.stringify(brief.place.highlight ?? []),
    year: brief.time.year,
    time_display: brief.time.display,
    era: brief.time.era,
    event: String(brief.event).trim(),
  };
}

// Run one request with streaming; transparently resume server-tool pause_turn.
async function runToCompletion(client, params) {
  let messages = params.messages;
  for (let attempt = 0; attempt < 8; attempt++) {
    const stream = client.messages.stream({ ...params, messages });
    const message = await stream.finalMessage();
    if (message.stop_reason !== "pause_turn") return message;
    messages = [...messages, { role: "assistant", content: message.content }];
  }
  throw new Error("Request still paused after 8 continuations");
}

function textOf(message) {
  return message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

async function research(client, args, brief) {
  const template = fs.readFileSync(path.join(PROMPTS_DIR, args.prompts, "research.md"), "utf8");
  const prompt = render(template, briefVars(brief));
  console.log(`  researching (${args.model}, web search)...`);
  const message = await runToCompletion(client, {
    model: args.model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 12 }],
    messages: [{ role: "user", content: prompt }],
  });
  return textOf(message);
}

async function write(client, args, brief, factSheet) {
  const template = fs.readFileSync(path.join(PROMPTS_DIR, args.prompts, "write.md"), "utf8");
  const prompt = render(template, {
    ...briefVars(brief),
    fact_sheet: factSheet,
    model: args.model,
    prompt_version: args.prompts,
    date: new Date().toISOString().slice(0, 10),
    method: "pipeline",
  });
  console.log(`  writing (${args.model})...`);
  const message = await runToCompletion(client, {
    model: args.model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });
  let story = textOf(message).trim();
  // The model may wrap the file in a ```markdown fence; unwrap it.
  const fence = story.match(/^```(?:markdown)?\n([\s\S]*?)\n```\s*$/);
  if (fence) story = fence[1];
  if (!story.startsWith("---")) throw new Error("Story output missing frontmatter");
  return story + "\n";
}

async function generateOne(client, args, briefPath) {
  const brief = YAML.parse(fs.readFileSync(briefPath, "utf8"));
  const outPath = path.join(STORIES_DIR, `${brief.id}.md`);
  if (fs.existsSync(outPath) && !args.force) {
    console.log(`- ${brief.id}: story exists, skipping (use --force to regenerate)`);
    return;
  }
  console.log(`- ${brief.id}`);
  const factSheet = await research(client, args, brief);
  const story = await write(client, args, brief, factSheet);
  fs.mkdirSync(STORIES_DIR, { recursive: true });
  fs.writeFileSync(outPath, story);
  console.log(`  wrote ${path.relative(process.cwd(), outPath)}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.brief && !args.all) {
    console.error("Pass --brief <path> or --all. See --help.");
    process.exit(1);
  }
  const client = new Anthropic();
  const briefPaths = args.all
    ? fs.readdirSync(BRIEFS_DIR).filter((f) => f.endsWith(".yaml")).map((f) => path.join(BRIEFS_DIR, f)).sort()
    : [path.resolve(args.brief)];
  for (const briefPath of briefPaths) {
    await generateOne(client, args, briefPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
