<script>
  let { stories, onOpenStory, showPlace = false } = $props();
</script>

<div class="list">
  {#if !stories.length}
    <p class="empty">No stories here yet — the library is still growing.</p>
  {/if}
  {#each stories as s (s.id)}
    <button class="card" onclick={() => onOpenStory(s)}>
      <div class="meta">
        <span class="when">{s.time.display}</span>
        <span class="where">{s.place.name}</span>
      </div>
      <div class="card-title">{s.title}</div>
      <div class="event">{s.event}</div>
      <div class="foot">☾ {s.reading_time_minutes} min read-aloud · {s.time.era}</div>
    </button>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .empty {
    color: var(--ink-dim);
    font-style: italic;
  }
  .card {
    text-align: left;
    background: var(--night-3);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
    display: block;
    width: 100%;
  }
  .card:hover {
    border-color: var(--gold-soft);
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  }
  .meta {
    display: flex;
    justify-content: space-between;
    font-family: var(--sans);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.3rem;
  }
  .where {
    color: var(--ink-dim);
  }
  .card-title {
    font-size: 1.08rem;
    line-height: 1.35;
    color: var(--ink);
  }
  .event {
    margin-top: 0.3rem;
    font-size: 0.85rem;
    color: var(--ink-dim);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .foot {
    margin-top: 0.5rem;
    font-family: var(--sans);
    font-size: 0.72rem;
    color: var(--ink-dim);
  }
</style>
