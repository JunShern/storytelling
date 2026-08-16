<script>
  import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
  import { feature } from "topojson-client";
  import world from "world-atlas/countries-110m.json";

  let { stories, selectedCountry, onSelectCountry, onOpenStory } = $props();

  const W = 960;
  const H = 500;
  const projection = geoNaturalEarth1().fitExtent(
    [
      [8, 8],
      [W - 8, H - 8],
    ],
    { type: "Sphere" },
  );
  const path = geoPath(projection);
  const countries = feature(world, world.objects.countries).features;
  const spherePath = path({ type: "Sphere" });
  const graticulePath = path(geoGraticule10());

  // Countries that have at least one story.
  const storiedCountries = $derived(
    new Set(stories.flatMap((s) => s.place.highlight ?? [])),
  );

  // Markers carry a chronological index so they can "light up" in the order
  // history happened — oldest story first, like stars appearing at dusk.
  const markers = $derived.by(() => {
    const byYear = [...stories].sort((a, b) => a.time.year - b.time.year);
    const chrono = new Map(byYear.map((s, i) => [s.id, i]));
    return stories.map((s) => {
      const [x, y] = projection([s.place.lng, s.place.lat]);
      return { story: s, x, y, order: chrono.get(s.id) ?? 0 };
    });
  });

  // The thread of history: a faint line joining the stories in time order,
  // drawn softly through midpoints so it reads as one continuous journey.
  const threadPath = $derived.by(() => {
    const pts = [...markers].sort((a, b) => a.order - b.order);
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x},${pts[i].y} ${mx},${my}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x},${last.y}`;
    return d;
  });

  function countryClass(c) {
    let cls = "country";
    if (storiedCountries.has(c.id)) cls += " storied";
    if (c.id === selectedCountry) cls += " selected";
    return cls;
  }

  function clickCountry(c) {
    if (storiedCountries.has(c.id)) onSelectCountry(c.id);
    else onSelectCountry(null);
  }
</script>

<div class="map-frame">
  <svg viewBox="0 0 {W} {H}" role="img" aria-label="World map of story locations">
    <path d={spherePath} class="sphere" />
    <path d={graticulePath} class="graticule" />
    {#each countries as c, i (c.id ?? `noid-${i}`)}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <path d={path(c)} class={countryClass(c)} onclick={() => clickCountry(c)} />
    {/each}
    {#if threadPath}
      <path d={threadPath} class="thread" pathLength="1" />
    {/if}
    {#each markers as m (m.story.id)}
      <g
        class="marker"
        style="--order:{m.order}"
        transform="translate({m.x},{m.y})"
        role="button"
        tabindex="0"
        aria-label={`${m.story.title} — ${m.story.place.name}, ${m.story.time.display}`}
        onclick={() => onOpenStory(m.story)}
        onkeydown={(e) => e.key === "Enter" && onOpenStory(m.story)}
      >
        <circle class="hit" r="15" />
        <circle class="halo" r="9" style="animation-delay: {(m.order * 0.37) % 3.2}s" />
        <circle class="dot" r="3.6" />
        <text class="label" y="-13">{m.story.place.name}</text>
        <title>{m.story.title} · {m.story.time.display}</title>
      </g>
    {/each}
  </svg>
</div>

<style>
  .map-frame {
    background: var(--night-2);
    border: 1px solid var(--line);
    border-radius: 14px;
    overflow: hidden;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .sphere {
    fill: var(--ocean);
  }
  .graticule {
    fill: none;
    stroke: rgba(233, 226, 207, 0.045);
    stroke-width: 0.5;
  }
  .country {
    fill: var(--land);
    stroke: var(--night);
    stroke-width: 0.5;
    transition: fill 0.2s;
  }
  .country.storied {
    cursor: pointer;
    fill: var(--land-hover);
  }
  .country.storied:hover {
    fill: var(--land-active);
  }
  .country.selected {
    fill: var(--land-active);
    stroke: var(--gold);
    stroke-width: 0.8;
  }

  /* The golden thread of history draws itself once, oldest story to newest. */
  .thread {
    fill: none;
    stroke: var(--gold);
    stroke-width: 0.9;
    stroke-linecap: round;
    opacity: 0.22;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw-thread 3.4s ease-out 0.5s forwards;
    pointer-events: none;
  }
  @keyframes draw-thread {
    to {
      stroke-dashoffset: 0;
    }
  }

  .marker {
    cursor: pointer;
    outline: none;
    opacity: 0;
    animation: marker-in 0.7s ease-out forwards;
    animation-delay: calc(0.4s + var(--order) * 0.115s);
  }
  @keyframes marker-in {
    from {
      opacity: 0;
    }
    60% {
      opacity: 1;
    }
    to {
      opacity: 1;
    }
  }
  .hit {
    fill: transparent;
  }
  .halo {
    fill: var(--gold);
    opacity: 0.16;
    animation: twinkle 3.2s ease-in-out infinite;
  }
  .dot {
    fill: var(--gold);
    stroke: var(--night);
    stroke-width: 0.8;
  }
  .label {
    fill: var(--ink);
    font-family: var(--sans);
    font-size: 10.5px;
    text-anchor: middle;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    paint-order: stroke;
    stroke: var(--night);
    stroke-width: 3px;
  }
  .marker:hover .label,
  .marker:focus .label {
    opacity: 1;
  }

  /* On phones the whole map is ~200px tall — grow the stars so they stay
     visible and tappable (r is animatable CSS on SVG circles). */
  @media (max-width: 860px) {
    .dot {
      r: 5;
    }
    .halo {
      r: 12;
    }
    .hit {
      r: 19;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .thread {
      animation: none;
      stroke-dashoffset: 0;
    }
    .marker {
      animation: none;
      opacity: 1;
    }
    .halo {
      animation: none;
    }
  }
</style>
