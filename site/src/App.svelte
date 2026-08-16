<script>
  import { onMount, tick } from "svelte";
  import { loadIndex, loadStory } from "./lib/data.js";
  import Starfield from "./lib/Starfield.svelte";
  import WorldMap from "./lib/WorldMap.svelte";
  import Timeline from "./lib/Timeline.svelte";
  import StoryList from "./lib/StoryList.svelte";
  import Reader from "./lib/Reader.svelte";

  let stories = $state([]);
  let selectedCountry = $state(null);
  let reader = $state(null);
  let loadError = $state(null);
  let listEl = $state(null);

  const filtered = $derived(
    selectedCountry
      ? stories.filter((s) => (s.place.highlight ?? []).includes(selectedCountry))
      : stories,
  );
  const selectedPlaceName = $derived(
    selectedCountry && filtered.length ? filtered[0].place.modern_country : null,
  );

  onMount(async () => {
    try {
      stories = await loadIndex();
    } catch (e) {
      loadError = e.message;
    }
  });

  async function openStory(meta) {
    try {
      reader = await loadStory(meta.id);
    } catch (e) {
      loadError = e.message;
    }
  }

  async function selectCountry(id) {
    selectedCountry = selectedCountry === id ? null : id;
    // On small screens the list sits below the map — bring it into view so
    // tapping a country visibly answers with its stories.
    if (selectedCountry && window.matchMedia("(max-width: 860px)").matches) {
      await tick();
      listEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function surprise() {
    if (!stories.length) return;
    openStory(stories[Math.floor(Math.random() * stories.length)]);
  }
</script>

<Starfield />

<div class="app">
  <header>
    <div class="title">
      <h1><span class="moon">☾</span> Bedtime Histories</h1>
      <p class="tagline">A story from somewhere, sometime — read aloud before sleep.</p>
    </div>
    <button class="surprise" onclick={surprise} disabled={!stories.length}>
      ✦ Tonight's story
    </button>
  </header>

  {#if loadError}
    <p class="error">Something went wrong loading the stories: {loadError}</p>
  {/if}

  <main>
    <div class="map-column">
      <WorldMap
        {stories}
        {selectedCountry}
        onSelectCountry={selectCountry}
        onOpenStory={openStory}
      />
      <p class="map-hint">
        {#if selectedCountry}
          Showing stories from one corner of the world.
        {:else}
          Every light is a story — tap one, or tap a glowing land.
        {/if}
      </p>
      <Timeline stories={stories} highlighted={filtered} onOpenStory={openStory} />
    </div>
    <aside bind:this={listEl}>
      <div class="aside-head">
        {#if selectedCountry}
          <h2>{selectedPlaceName ?? "This place"}</h2>
          <button class="clear" onclick={() => (selectedCountry = null)}>show all</button>
        {:else}
          <h2>All stories</h2>
        {/if}
      </div>
      <StoryList stories={filtered} onOpenStory={openStory} />
    </aside>
  </main>

  <footer>
    <p>
      Stories are historical fiction grounded in real research — each one ends with
      “what’s true in this story.”
    </p>
  </footer>
</div>

{#if reader}
  <Reader story={reader} onClose={() => (reader = null)} />
{/if}

<style>
  .app {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 1.2rem 1.5rem 2rem;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
  }
  h1 {
    margin: 0;
    font-size: 1.7rem;
    color: var(--ink);
  }
  .moon {
    color: var(--gold);
    font-size: 1.25rem;
    vertical-align: 0.12em;
    margin-right: 0.1rem;
    display: inline-block;
    animation: moon-rise 1.2s ease-out both;
  }
  @keyframes moon-rise {
    from {
      opacity: 0;
      transform: translateY(6px) rotate(-12deg);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .tagline {
    margin: 0.15rem 0 0;
    color: var(--ink-dim);
    font-size: 0.95rem;
    font-style: italic;
  }
  .surprise {
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    background: var(--night-3);
    border: 1px solid var(--gold-soft);
    color: var(--gold);
    padding: 0.55rem 1.1rem;
    border-radius: 999px;
    font-size: 0.95rem;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .surprise::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      transparent 30%,
      rgba(226, 181, 99, 0.16) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    animation: shimmer 6s ease-in-out infinite;
  }
  @keyframes shimmer {
    0%,
    75% {
      transform: translateX(-100%);
    }
    95%,
    100% {
      transform: translateX(100%);
    }
  }
  .surprise:hover {
    background: var(--land-hover);
    box-shadow: 0 0 18px rgba(226, 181, 99, 0.25);
  }

  .error {
    color: #e08a8a;
  }

  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 310px;
    gap: 1.5rem;
    align-items: start;
  }
  .map-column {
    min-width: 0;
  }
  .map-hint {
    margin: 0.5rem 0.2rem 0;
    color: var(--ink-dim);
    font-family: var(--sans);
    font-size: 0.75rem;
    letter-spacing: 0.02em;
    text-align: center;
    opacity: 0;
    animation: hint-in 1s ease-out 1.6s forwards;
  }
  @keyframes hint-in {
    to {
      opacity: 1;
    }
  }

  aside {
    background: var(--night-2);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 1rem;
    max-height: 78vh;
    overflow-y: auto;
  }
  .aside-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }
  .aside-head h2 {
    margin: 0;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: var(--sans);
    font-weight: 600;
    font-size: 0.75rem;
  }
  .clear {
    color: var(--gold);
    font-size: 0.8rem;
    font-family: var(--sans);
  }

  footer {
    margin-top: auto;
    padding-top: 1.5rem;
  }
  footer p {
    color: var(--ink-dim);
    font-size: 0.8rem;
    font-family: var(--sans);
    text-align: center;
  }

  @media (max-width: 860px) {
    .app {
      padding: 1rem 0.9rem 2rem;
    }
    main {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    aside {
      max-height: none;
      overflow: visible;
      scroll-margin-top: 0.75rem;
    }
    header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    }
    .surprise {
      align-self: stretch;
      text-align: center;
      padding: 0.8rem 1.1rem;
      font-size: 1.05rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .moon,
    .map-hint {
      animation: none;
      opacity: 1;
    }
    .surprise::after {
      animation: none;
    }
  }
</style>
