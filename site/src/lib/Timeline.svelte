<script>
  import { yearToT, formatYear, TICKS } from "./timescale.js";

  let { stories, highlighted, onOpenStory } = $props();

  const highlightedIds = $derived(new Set(highlighted.map((s) => s.id)));

  const dots = $derived(
    stories.map((s) => ({
      story: s,
      x: yearToT(s.time.year) * 100,
      active: highlightedIds.has(s.id),
    })),
  );
</script>

<div class="timeline" aria-label="Timeline of stories">
  <div class="track"></div>
  {#each TICKS as tick (tick)}
    <div class="tick" style="left: {yearToT(tick) * 100}%">
      <div class="tick-mark"></div>
      <div class="tick-label">{formatYear(tick)}</div>
    </div>
  {/each}
  {#each dots as d (d.story.id)}
    <button
      class="dot-wrap"
      class:dim={!d.active}
      style="left: {d.x}%"
      title={`${d.story.title} — ${d.story.place.name}, ${d.story.time.display}`}
      onclick={() => onOpenStory(d.story)}
    >
      <span class="dot"></span>
      <span class="dot-label">{d.story.time.display}</span>
    </button>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    height: 74px;
    margin-top: 1rem;
    padding: 0 0.5rem;
  }
  .track {
    position: absolute;
    left: 0;
    right: 0;
    top: 26px;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(233, 226, 207, 0.25) 8%,
      rgba(233, 226, 207, 0.25) 92%,
      transparent
    );
  }
  .tick {
    position: absolute;
    top: 22px;
    transform: translateX(-50%);
    text-align: center;
  }
  .tick-mark {
    width: 1px;
    height: 9px;
    background: rgba(233, 226, 207, 0.25);
    margin: 0 auto;
  }
  .tick-label {
    margin-top: 4px;
    font-family: var(--sans);
    font-size: 0.62rem;
    color: var(--ink-dim);
    white-space: nowrap;
  }
  .dot-wrap {
    position: absolute;
    top: 26px;
    transform: translate(-50%, -50%);
    padding: 8px;
    line-height: 0;
  }
  .dot {
    display: block;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 10px rgba(226, 181, 99, 0.55);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  }
  .dot-wrap:hover .dot {
    transform: scale(1.35);
    box-shadow: 0 0 16px rgba(226, 181, 99, 0.9);
  }
  .dot-wrap.dim .dot {
    opacity: 0.25;
    box-shadow: none;
  }
  .dot-label {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 0.62rem;
    color: var(--gold);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
    line-height: 1;
  }
  .dot-wrap:hover .dot-label {
    opacity: 1;
  }
</style>
