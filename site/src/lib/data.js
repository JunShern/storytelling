// Loads the compiled story data produced by scripts/build-content.js.
const base = import.meta.env.BASE_URL;

export async function loadIndex() {
  const res = await fetch(`${base}data/index.json`);
  if (!res.ok) throw new Error(`Failed to load story index (${res.status})`);
  return res.json();
}

export async function loadStory(id) {
  const res = await fetch(`${base}data/stories/${id}.json`);
  if (!res.ok) throw new Error(`Failed to load story ${id} (${res.status})`);
  return res.json();
}
