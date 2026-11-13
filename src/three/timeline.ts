/**
 * Deterministic, scroll-indexed timeline.
 * Every transform in the 3D story is a pure function of `s` (0 → 1),
 * so scrolling backwards replays the exact same frames in reverse.
 */

export type Vec3 = [number, number, number];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Normalised position of `s` inside [a, b] */
export const seg = (s: number, a: number, b: number) => clamp01((s - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Story beats (fractions of the pinned scroll). */
export const BEATS = {
  rotate: [0.0, 0.27] as const, // Scene 01 – 360° turn
  approach: [0.27, 0.39] as const, // Scene 02 – move to centre, camera closes in
  tear: [0.39, 0.49] as const, // top strip tears off
  open: [0.44, 0.54] as const, // mouth opens, inside revealed
  stripAway: [0.49, 0.56] as const,
  bowlIn: [0.5, 0.6] as const, // Scene 04 bowl slides in
  tilt: [0.53, 0.61] as const, // package tilts to pour
  pour: [0.6, 0.86] as const, // Scene 03/04 chips released over this window
  settle: [0.87, 0.97] as const, // Scene 05 package set down, camera settles
};

export interface Key<T> {
  s: number;
  v: T;
}

/** Piecewise interpolation with per-segment smoother-step easing. */
export function sampleNum(keys: Key<number>[], s: number): number {
  if (s <= keys[0].s) return keys[0].v;
  const last = keys[keys.length - 1];
  if (s >= last.s) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (s <= b.s) return lerp(a.v, b.v, smoother(seg(s, a.s, b.s)));
  }
  return last.v;
}

export function sampleVec(keys: Key<Vec3>[], s: number, out: Vec3 = [0, 0, 0]): Vec3 {
  for (let c = 0; c < 3; c++) {
    out[c] = sampleNum(
      keys.map((k) => ({ s: k.s, v: k.v[c] })),
      s,
    );
  }
  return out;
}

/** Pre-split vector tracks for zero-allocation sampling inside the render loop. */
export class VecTrack {
  private readonly tracks: Key<number>[][];
  constructor(keys: Key<Vec3>[]) {
    this.tracks = [0, 1, 2].map((c) => keys.map((k) => ({ s: k.s, v: k.v[c] })));
  }
  sample(s: number, out: Vec3): Vec3 {
    out[0] = sampleNum(this.tracks[0], s);
    out[1] = sampleNum(this.tracks[1], s);
    out[2] = sampleNum(this.tracks[2], s);
    return out;
  }
}

/** Small seeded PRNG (mulberry32) — identical chips on every load. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Layout = 'desktop' | 'mobile';

export interface Choreography {
  camPos: VecTrack;
  camTarget: VecTrack;
  pouchPos: VecTrack;
  pouchYaw: Key<number>[];
  pouchTilt: Key<number>[];
  pouchRoll: Key<number>[];
  bowlPos: VecTrack;
}

const TAU = Math.PI * 2;
const YAW0 = -0.38;

export interface PourPose {
  pos: Vec3;
  yaw: number;
  /** radians around Z: the top of the pouch points down-left into the bowl */
  tilt: number;
  roll: number;
}

/** Pouch pour pose — fixed per layout, so every chip's release point is deterministic. */
export function pourPose(layout: Layout): PourPose {
  return layout === 'mobile'
    ? { pos: [0.45, 2.95, 0.15], yaw: TAU - 0.45, tilt: 2.6, roll: 0.1 }
    : { pos: [0.95, 2.4, 0.15], yaw: TAU - 0.5, tilt: 2.25, roll: 0.12 };
}

export function buildChoreography(layout: Layout): Choreography {
  const m = layout === 'mobile';
  // Hero & scene-01 x-offset: package sits right of the copy on desktop, centred on mobile.
  const heroX = m ? 0 : 1.55;
  const POUR_POSE = pourPose(layout);
  return {
    pouchPos: new VecTrack([
      { s: 0, v: [heroX, 1.25, 0] },
      { s: 0.27, v: [m ? 0 : 1.05, 1.25, 0] },
      { s: 0.39, v: [0, 1.32, 0.2] },
      { s: 0.5, v: [0, 1.36, 0.2] },
      { s: 0.61, v: POUR_POSE.pos },
      { s: 0.86, v: POUR_POSE.pos },
      { s: 0.97, v: [m ? 0.85 : 1.4, 1.125, -0.45] },
    ]),
    pouchYaw: [
      { s: 0, v: YAW0 },
      { s: 0.27, v: YAW0 + TAU },
      { s: 0.39, v: TAU - 0.12 },
      { s: 0.5, v: TAU - 0.18 },
      { s: 0.61, v: POUR_POSE.yaw },
      { s: 0.86, v: POUR_POSE.yaw },
      { s: 0.97, v: TAU - 0.62 },
    ],
    pouchTilt: [
      { s: 0, v: 0 },
      { s: 0.39, v: 0 },
      { s: 0.53, v: 0.06 },
      { s: 0.61, v: POUR_POSE.tilt },
      { s: 0.86, v: POUR_POSE.tilt },
      { s: 0.97, v: 0 },
    ],
    pouchRoll: [
      { s: 0, v: 0 },
      { s: 0.39, v: 0.18 }, // tip the top towards camera so the tear reads
      { s: 0.5, v: 0.22 },
      { s: 0.61, v: POUR_POSE.roll },
      { s: 0.86, v: POUR_POSE.roll },
      { s: 0.97, v: 0 },
    ],
    bowlPos: new VecTrack([
      // slides in along the table from the left
      { s: 0, v: [m ? -3.2 : -4.6, 0, 0.2] },
      { s: 0.5, v: [m ? -3.2 : -4.6, 0, 0.2] },
      { s: 0.6, v: [0, 0, 0.2] },
      { s: 0.87, v: [0, 0, 0.2] },
      { s: 0.97, v: [m ? -0.45 : 0, 0, 0.35] },
    ]),
    camPos: new VecTrack(
      m
        ? [
            { s: 0, v: [0, 2.7, 11.5] },
            { s: 0.27, v: [-0.9, 2.4, 9.6] },
            { s: 0.39, v: [0, 2.5, 6.4] },
            { s: 0.5, v: [0.2, 2.9, 5.6] },
            { s: 0.61, v: [-0.4, 3.4, 10.8] },
            { s: 0.86, v: [0.2, 4.6, 10.6] },
            { s: 1, v: [0, 3.6, 12.5] },
          ]
        : [
            { s: 0, v: [0, 1.45, 7.6] },
            { s: 0.14, v: [-0.6, 1.7, 7.1] },
            { s: 0.27, v: [-0.9, 1.55, 6.9] },
            { s: 0.39, v: [0, 2.2, 4.7] },
            { s: 0.5, v: [0.15, 2.6, 4.1] },
            { s: 0.61, v: [-0.8, 2.6, 6.9] },
            { s: 0.86, v: [0.3, 3.4, 6.1] },
            { s: 1, v: [0, 2.6, 7.3] },
          ],
    ),
    camTarget: new VecTrack(
      m
        ? [
            { s: 0, v: [0, 2.65, 0] },
            { s: 0.27, v: [0, 1.6, 0] },
            { s: 0.39, v: [0, 1.75, 0] },
            { s: 0.5, v: [0, 2.05, 0] },
            { s: 0.61, v: [0, 2.2, 0] },
            { s: 0.86, v: [0, 1.95, 0] },
            { s: 1, v: [0.2, 2.1, 0] },
          ]
        : [
            { s: 0, v: [0, 1.25, 0] },
            { s: 0.27, v: [-0.15, 1.2, 0] },
            { s: 0.39, v: [0, 1.75, 0] },
            { s: 0.5, v: [0, 2.05, 0] },
            { s: 0.61, v: [-0.5, 1.3, 0] },
            { s: 0.86, v: [-0.45, 0.75, 0] },
            { s: 1, v: [-0.75, 0.85, 0] },
          ],
    ),
  };
}
