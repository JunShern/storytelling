import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Deployed at https://junshern.github.io/storytelling/ — the same base path is
// used in dev/preview too, so all three environments behave identically.
export default defineConfig({
  base: "/storytelling/",
  plugins: [svelte()],
});
