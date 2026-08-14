<script>
  let { story, onClose } = $props();

  // Minimal, safe markdown-inline rendering: escape HTML, then *em* / **strong**.
  function inline(text) {
    const escaped = text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    return escaped
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  const paragraphs = $derived(
    story.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  );

  const introParagraphs = $derived(
    (story.intro ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  );

  function onKeydown(e) {
    if (e.key === "Escape") onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />
<svelte:body style:overflow="hidden" />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="scrim" onclick={(e) => e.target === e.currentTarget && onClose()}>
  <div class="reader" aria-modal="true" role="dialog" aria-label={story.title}>
    <button class="close" onclick={onClose} aria-label="Close story">✕</button>

    <header>
      <div class="context">
        {story.place.name} · {story.time.display} · {story.time.era}
      </div>
      <h2>{story.title}</h2>
    </header>

    {#if introParagraphs.length}
      <aside class="intro">
        <div class="intro-label">☾ Before we begin</div>
        {#each introParagraphs as p, i (i)}
          <p>{@html inline(p)}</p>
        {/each}
      </aside>
    {/if}

    <div class="body">
      {#each paragraphs as p, i (i)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags — inline() escapes HTML first -->
        <p>{@html inline(p)}</p>
      {/each}
    </div>

    <div class="ending">☾ ✦ ☾</div>

    {#if story.facts.length}
      <details class="facts">
        <summary>What’s true in this story</summary>
        <ul>
          {#each story.facts as f, i (i)}
            <li>{@html inline(f)}</li>
          {/each}
        </ul>
        {#if story.sources.length}
          <div class="sources">
            <span>Sources:</span>
            {#each story.sources as url, i (i)}
              <a href={url} target="_blank" rel="noopener noreferrer">[{i + 1}]</a>
            {/each}
          </div>
        {/if}
      </details>
    {/if}
  </div>
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(6, 8, 18, 0.82);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    overflow-y: auto;
    z-index: 50;
    padding: 3vh 1rem;
  }
  .reader {
    position: relative;
    background: var(--night-2);
    border: 1px solid var(--line);
    border-radius: 16px;
    max-width: 680px;
    width: 100%;
    height: fit-content;
    padding: 2.4rem 2.6rem 2rem;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  }
  .close {
    position: absolute;
    top: 0.9rem;
    right: 1rem;
    color: var(--ink-dim);
    font-size: 1rem;
    padding: 0.4rem;
  }
  .close:hover {
    color: var(--ink);
  }
  .context {
    font-family: var(--sans);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
  }
  h2 {
    margin: 0.35rem 0 1.4rem;
    font-size: 1.75rem;
    line-height: 1.25;
  }
  .intro {
    background: rgba(226, 181, 99, 0.06);
    border: 1px solid var(--gold-soft);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    margin-bottom: 1.6rem;
  }
  .intro-label {
    font-family: var(--sans);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.5rem;
  }
  .intro p {
    font-size: 0.98rem;
    line-height: 1.7;
    color: var(--ink-dim);
    margin: 0 0 0.7em;
  }
  .intro p:last-child {
    margin-bottom: 0;
  }
  .body p {
    font-size: 1.08rem;
    line-height: 1.85;
    margin: 0 0 1.1em;
    color: var(--ink);
  }
  .body p:first-of-type::first-letter {
    font-size: 2.6em;
    line-height: 0.9;
    float: left;
    padding-right: 0.09em;
    color: var(--gold);
  }
  .ending {
    text-align: center;
    color: var(--gold-soft);
    letter-spacing: 0.6em;
    padding-left: 0.6em;
    margin: 1.6rem 0;
    font-size: 0.85rem;
  }
  .facts {
    border-top: 1px solid var(--line);
    padding-top: 1rem;
  }
  .facts summary {
    cursor: pointer;
    color: var(--gold);
    font-family: var(--sans);
    font-size: 0.85rem;
    letter-spacing: 0.04em;
  }
  .facts ul {
    margin: 0.8rem 0 0;
    padding-left: 1.2rem;
  }
  .facts li {
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--ink-dim);
    margin-bottom: 0.45rem;
  }
  .sources {
    margin-top: 0.9rem;
    font-family: var(--sans);
    font-size: 0.78rem;
    color: var(--ink-dim);
  }
  .sources a {
    margin-left: 0.4rem;
  }

  @media (max-width: 640px) {
    .scrim {
      padding: 0;
    }
    .reader {
      border-radius: 0;
      border: none;
      padding: 2.2rem 1.4rem 2rem;
      min-height: 100%;
    }
    .body p {
      font-size: 1.05rem;
    }
  }
</style>
