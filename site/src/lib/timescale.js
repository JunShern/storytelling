// Era-compressed timeline scale: history is sparse in deep antiquity and dense
// in recent centuries, so a linear year axis wastes most of its width.
// Piecewise-linear mapping from year -> [0, 1].

const STOPS = [
  [-3000, 0.0],
  [-500, 0.12],
  [500, 0.28],
  [1000, 0.42],
  [1500, 0.62],
  [1800, 0.82],
  [2000, 1.0],
];

export const TIMELINE_START = STOPS[0][0];
export const TIMELINE_END = STOPS[STOPS.length - 1][0];

export function yearToT(year) {
  const y = Math.max(TIMELINE_START, Math.min(TIMELINE_END, year));
  for (let i = 1; i < STOPS.length; i++) {
    const [y0, t0] = STOPS[i - 1];
    const [y1, t1] = STOPS[i];
    if (y <= y1) return t0 + ((y - y0) / (y1 - y0)) * (t1 - t0);
  }
  return 1;
}

export function formatYear(year) {
  return year < 0 ? `${-year} BCE` : `${year} CE`;
}

// Tick years chosen to read well on the compressed scale.
export const TICKS = [-3000, -1000, 0, 500, 1000, 1300, 1500, 1700, 1850, 2000];
