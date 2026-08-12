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

  const markers = $derived(
    stories.map((s) => {
      const [x, y] = projection([s.place.lng, s.place.lat]);
      return { story: s, x, y };
    }),
  );

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
    {#each markers as m (m.story.id)}
      <g
        class="marker"
        transform="translate({m.x},{m.y})"
        role="button"
        tabindex="0"
        aria-label={`${m.story.title} — ${m.story.place.name}, ${m.story.time.display}`}
        onclick={() => onOpenStory(m.story)}
        onkeydown={(e) => e.key === "Enter" && onOpenStory(m.story)}
      >
        <circle class="halo" r="9" />
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
  .marker {
    cursor: pointer;
    outline: none;
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
</style>
