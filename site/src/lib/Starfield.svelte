<script>
  // A fixed, very quiet night sky behind the whole app: small twinkling stars
  // and the occasional shooting star. Pure CSS animation — cheap to render,
  // and fully disabled under prefers-reduced-motion.
  const STAR_COUNT = 90;

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() < 0.85 ? 0.8 + Math.random() * 0.7 : 1.6 + Math.random() * 0.8,
    delay: Math.random() * 6,
    duration: 2.5 + Math.random() * 4,
    base: 0.25 + Math.random() * 0.5,
  }));
</script>

<div class="sky" aria-hidden="true">
  <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
    {#each stars as s (s.id)}
      <circle
        cx={s.x}
        cy={s.y}
        r={s.r * 0.09}
        style="--base:{s.base}; animation-delay:{s.delay}s; animation-duration:{s.duration}s"
      />
    {/each}
  </svg>
  <span class="shooting one"></span>
  <span class="shooting two"></span>
</div>

<style>
  .sky {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  circle {
    fill: #e9e2cf;
    opacity: var(--base);
    animation: star-breathe ease-in-out infinite;
  }
  @keyframes star-breathe {
    0%,
    100% {
      opacity: var(--base);
    }
    50% {
      opacity: calc(var(--base) * 0.25);
    }
  }

  .shooting {
    position: absolute;
    top: 12%;
    left: -12%;
    width: 110px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(233, 226, 207, 0.85));
    border-radius: 999px;
    transform: rotate(16deg);
    opacity: 0;
    animation: shoot 16s linear infinite;
  }
  .shooting.two {
    top: 55%;
    transform: rotate(11deg);
    animation-delay: 9s;
    animation-duration: 21s;
  }
  @keyframes shoot {
    0%,
    96% {
      opacity: 0;
      translate: 0 0;
    }
    96.5% {
      opacity: 0.9;
    }
    99.5% {
      opacity: 0;
      translate: 130vw 32vh;
    }
    100% {
      opacity: 0;
      translate: 130vw 32vh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    circle {
      animation: none;
    }
    .shooting {
      display: none;
    }
  }
</style>
