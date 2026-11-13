/**
 * Banana chips: irregular, cupped, thick slices rendered with InstancedMesh
 * (3 geometry variants × per-instance scale/colour → no two chips look alike).
 *
 * The pour is fully deterministic: each chip has a precomputed resting pose in
 * the bowl, a release moment on the scroll timeline, and an analytic ballistic
 * path (gravity parabola → landing bounce → settle). Scrolling backwards
 * replays exactly the same motion in reverse.
 */
import * as THREE from 'three';
import { bowlInnerRadius, bowlInnerSlope, bowlInnerY } from './bowl';
import { clamp01, rng, seg, smoother } from './timeline';

const VARIANTS = 3;

function chipGeometry(seed: number, R: number, thickness: number): THREE.BufferGeometry {
  const rand = rng(seed * 977 + 13);
  const p = [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const oval = 0.86 + rand() * 0.12;
  const cup = R * (0.22 + rand() * 0.18);
  const warp = R * (0.08 + rand() * 0.1);
  const rings = 5;
  const segs = 30;
  const outline = (th: number) =>
    R * (1 + 0.055 * Math.sin(3 * th + p[0]) + 0.04 * Math.sin(5 * th + p[1]) + 0.025 * Math.sin(9 * th + p[2]));
  const height = (rho: number, th: number) => cup * rho * rho + warp * rho * Math.sin(2 * th + p[3]);
  const thick = (rho: number) => thickness * (1 - 0.45 * rho * rho);

  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  const addSurface = (top: boolean) => {
    const base = pos.length / 3;
    const sign = top ? 0.5 : -0.5;
    pos.push(0, height(0, 0) + sign * thick(0), 0);
    uv.push(0.5, 0.5);
    for (let r = 1; r <= rings; r++) {
      const rho = r / rings;
      for (let s = 0; s < segs; s++) {
        const th = (s / segs) * Math.PI * 2;
        const rad = outline(th) * rho;
        const x = Math.cos(th) * rad;
        const z = Math.sin(th) * rad * oval;
        pos.push(x, height(rho, th) + sign * thick(rho), z);
        uv.push(0.5 + (Math.cos(th) * rho) / 2, 0.5 + (Math.sin(th) * rho) / 2);
      }
    }
    const ring = (r: number, s: number) => base + 1 + (r - 1) * segs + (s % segs);
    for (let s = 0; s < segs; s++) {
      top ? idx.push(base, ring(1, s + 1), ring(1, s)) : idx.push(base, ring(1, s), ring(1, s + 1));
    }
    for (let r = 1; r < rings; r++) {
      for (let s = 0; s < segs; s++) {
        const a = ring(r, s);
        const b = ring(r, s + 1);
        const c = ring(r + 1, s);
        const d = ring(r + 1, s + 1);
        top ? idx.push(a, b, d, a, d, c) : idx.push(a, d, b, a, c, d);
      }
    }
    return (s: number) => ring(rings, s);
  };
  const topRim = addSurface(true);
  const botRim = addSurface(false);
  for (let s = 0; s < segs; s++) {
    const a = topRim(s);
    const b = topRim(s + 1);
    const c = botRim(s);
    const d = botRim(s + 1);
    idx.push(a, c, d, a, d, b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Procedural slice texture: golden flesh, seed star, radial fibres, chili-lime spice dust. */
function chipTexture(): THREE.CanvasTexture {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const c = cv.getContext('2d')!;
  const rand = rng(42);
  const g = c.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
  g.addColorStop(0, '#f6d27a');
  g.addColorStop(0.45, '#eebf5c');
  g.addColorStop(0.82, '#dc9d3f');
  g.addColorStop(0.94, '#b8752c');
  g.addColorStop(1, '#8f5520');
  c.fillStyle = g;
  c.fillRect(0, 0, S, S);
  // radial fibres
  c.globalAlpha = 0.18;
  for (let i = 0; i < 140; i++) {
    const a = rand() * Math.PI * 2;
    const r0 = S * (0.14 + rand() * 0.1);
    const r1 = S * (0.38 + rand() * 0.1);
    c.strokeStyle = rand() > 0.5 ? '#fff1c4' : '#b9792f';
    c.lineWidth = 0.6 + rand();
    c.beginPath();
    c.moveTo(S / 2 + Math.cos(a) * r0, S / 2 + Math.sin(a) * r0);
    c.lineTo(S / 2 + Math.cos(a) * r1, S / 2 + Math.sin(a) * r1);
    c.stroke();
  }
  c.globalAlpha = 1;
  // seed core: soft three-lobed star with dark seeds
  c.save();
  c.translate(S / 2, S / 2);
  c.fillStyle = 'rgba(176,112,40,0.45)';
  c.beginPath();
  for (let i = 0; i <= 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const r = S * (0.07 + 0.035 * Math.cos(3 * a));
    i ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.fill();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rand() * 0.2;
    const r = S * (0.09 + rand() * 0.03);
    c.fillStyle = 'rgba(70,40,18,0.85)';
    c.beginPath();
    c.ellipse(Math.cos(a) * r, Math.sin(a) * r, 2.2, 1.4, a, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  // chili flakes + spice dust + sugar glints
  for (let i = 0; i < 260; i++) {
    const t = rand();
    c.fillStyle = t < 0.35 ? 'rgba(168,52,24,0.75)' : t < 0.75 ? 'rgba(110,62,26,0.55)' : 'rgba(255,248,220,0.7)';
    const s = 0.8 + rand() * (t < 0.35 ? 2.6 : 1.4);
    c.fillRect(rand() * S, rand() * S, s, s * (0.6 + rand() * 0.8));
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface ChipPlan {
  variant: number;
  slot: number;
  scale: THREE.Vector3;
  rest: THREE.Vector3; // bowl-local
  restQ: THREE.Quaternion;
  spinAxis: THREE.Vector3;
  spin: number;
  release: number; // timeline s
  interior: [number, number, number];
  jitter: THREE.Vector3; // exit spread
  landing: THREE.Vector3; // bowl-local offset where it first touches, slides to rest
  bounce: number;
}

export interface ChipFrameState {
  s: number;
  fallDuration: number;
  /** chips are staged inside the bag only once it is open enough to see in */
  stageVisible: boolean;
  pouchMatrix: THREE.Matrix4;
  /** world-space mouth position at the (fixed) pour pose + exit direction */
  mouthWorld: THREE.Vector3;
  exitDir: THREE.Vector3;
  bowlPos: THREE.Vector3;
  interiorPoint: (r1: number, r2: number, r3: number, out: THREE.Vector3) => THREE.Vector3;
}

export class ChipSystem {
  readonly object = new THREE.Group();
  readonly count: number;
  private readonly meshes: THREE.InstancedMesh[] = [];
  private readonly geos: THREE.BufferGeometry[] = [];
  private readonly material: THREE.MeshStandardMaterial;
  private readonly plans: ChipPlan[] = [];
  // scratch
  private readonly m = new THREE.Matrix4();
  private readonly p = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly qs = new THREE.Quaternion();
  private readonly v0 = new THREE.Vector3();
  private readonly v1 = new THREE.Vector3();
  private readonly zero = new THREE.Vector3(0, 0, 0);

  constructor(count: number, chipRadius: number, pourWindow: readonly [number, number], fallDuration: number) {
    this.count = count;
    const tex = chipTexture();
    this.material = new THREE.MeshStandardMaterial({
      map: tex,
      bumpMap: tex,
      bumpScale: 1.2,
      roughness: 0.58,
      metalness: 0,
    });
    const perVariant = Math.ceil(count / VARIANTS);
    for (let v = 0; v < VARIANTS; v++) {
      const geo = chipGeometry(v + 1, chipRadius, chipRadius * 0.2);
      const mesh = new THREE.InstancedMesh(geo, this.material, perVariant);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false; // instances travel far from the geometry's bounds
      this.geos.push(geo);
      this.meshes.push(mesh);
      this.object.add(mesh);
    }
    this.plan(chipRadius, pourWindow, fallDuration);
  }

  /** Deterministic pile: layered sunflower packing that follows the bowl's curved wall. */
  private plan(R: number, pour: readonly [number, number], fall: number) {
    const rand = rng(2024);
    const color = new THREE.Color();
    const counters = new Array(VARIANTS).fill(0);
    let y = bowlInnerY(0) + R * 0.22;
    let placed = 0;
    let layer = 0;
    const N = this.count;
    while (placed < N) {
      const rr = Math.max(R * 0.4, bowlInnerRadius(y + R * 0.2) - R * 0.7);
      const capacity = Math.max(1, Math.floor((rr * rr) / (R * R) * 0.95));
      const inLayer = Math.min(capacity, N - placed);
      const isTop = placed + inLayer >= N;
      for (let k = 0; k < inLayer; k++) {
        const i = placed + k;
        const variant = i % VARIANTS;
        const r = rr * Math.sqrt((k + 0.5) / capacity) * (0.92 + rand() * 0.08);
        const th = k * 2.39996 + layer * 1.1 + rand() * 0.4;
        const x = Math.cos(th) * r;
        const z = Math.sin(th) * r;
        let restY = Math.max(y + (rand() - 0.5) * R * 0.25, bowlInnerY(r) + R * 0.22);
        if (isTop) restY += R * 0.9 * (1 - (r / rr) ** 2) * (0.6 + rand() * 0.4);
        // tilt: lean with the bowl wall + natural randomness from overlapping
        const slope = bowlInnerSlope(r) * 0.85;
        const tangentAxis = new THREE.Vector3(-Math.sin(th), 0, Math.cos(th));
        const restQ = new THREE.Quaternion()
          .setFromAxisAngle(tangentAxis, -slope)
          .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 0.7, rand() * 6.28, (rand() - 0.5) * 0.7)));
        if (rand() < 0.12) restQ.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)); // some flipped
        const sc = 0.82 + rand() * 0.36;
        const release = pour[0] + (pour[1] - fall - pour[0]) * Math.pow(i / Math.max(1, N - 1), 0.92);
        const plan: ChipPlan = {
          variant,
          slot: counters[variant]++,
          scale: new THREE.Vector3(sc * (0.92 + rand() * 0.16), sc * (0.85 + rand() * 0.3), sc * (0.92 + rand() * 0.16)),
          rest: new THREE.Vector3(x, restY, z),
          restQ,
          spinAxis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
          spin: 5 + rand() * 9,
          release,
          interior: [rand(), rand(), rand()],
          jitter: new THREE.Vector3((rand() - 0.5) * 0.22, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.22),
          landing: new THREE.Vector3((rand() - 0.5) * R * 1.6, 0, (rand() - 0.5) * R * 1.6),
          bounce: R * (0.35 + rand() * 0.6),
        };
        this.plans.push(plan);
        // golden variation: some paler, some more caramelised
        const tone = rand();
        color.setRGB(0.92 + tone * 0.12, 0.84 + tone * 0.14, 0.72 + tone * 0.22);
        this.meshes[variant].setColorAt(plan.slot, color);
      }
      placed += inLayer;
      layer++;
      y += R * 0.32;
    }
    this.meshes.forEach((mesh, v) => {
      mesh.count = counters[v]; // never draw unused slots
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
  }

  update(st: ChipFrameState) {
    const { m, p, q, qs, v0, v1 } = this;
    for (const c of this.plans) {
      const tau = seg(st.s, c.release, c.release + st.fallDuration);
      let visible = true;
      if (tau <= 0) {
        // staged inside the bag, moves with the bag
        if (!st.stageVisible) visible = false;
        st.interiorPoint(c.interior[0], c.interior[1], c.interior[2], p).applyMatrix4(st.pouchMatrix);
        q.setFromAxisAngle(c.spinAxis, c.spin).multiply(c.restQ);
      } else {
        const EMERGE = 0.16;
        const LAND = 0.78;
        // start: interior point at the pour pose (fixed) → mouth
        st.interiorPoint(c.interior[0], c.interior[1], c.interior[2], v0).applyMatrix4(st.pouchMatrix);
        v1.copy(st.mouthWorld).addScaledVector(st.exitDir, 0.12).add(c.jitter);
        if (tau < EMERGE) {
          p.lerpVectors(v0, v1, smoother(tau / EMERGE));
        } else if (tau < LAND) {
          // ballistic flight: constant horizontal velocity, gravity on y (exact parabola)
          const t = (tau - EMERGE) / (LAND - EMERGE);
          const tx = st.bowlPos.x + c.rest.x + c.landing.x;
          const tz = st.bowlPos.z + c.rest.z + c.landing.z;
          const ty = st.bowlPos.y + c.rest.y + 0.01;
          const vy0 = st.exitDir.y * 0.35; // initial vertical velocity from the pour direction
          const g = v1.y + vy0 - ty; // ensures y(1) = ty
          const push = Math.sin(Math.PI * t) * 0.18; // keeps moving along exit dir early on
          p.set(
            v1.x + (tx - v1.x) * t + st.exitDir.x * push,
            v1.y + vy0 * t - g * t * t,
            v1.z + (tz - v1.z) * t + st.exitDir.z * push,
          );
        } else {
          // bounce & slide to rest
          const t = (tau - LAND) / (1 - LAND);
          const slide = smoother(t);
          p.set(
            st.bowlPos.x + c.rest.x + c.landing.x * (1 - slide),
            st.bowlPos.y + c.rest.y + 0.01 * (1 - t) + c.bounce * Math.sin(Math.PI * Math.min(1, t * 1.6)) * (1 - t),
            st.bowlPos.z + c.rest.z + c.landing.z * (1 - slide),
          );
        }
        // tumbling decays to the resting orientation
        const spinLeft = c.spin * (1 - smoother(clamp01(tau / 0.98)));
        q.setFromAxisAngle(c.spinAxis, spinLeft).multiply(c.restQ);
        if (tau >= 1) p.set(st.bowlPos.x + c.rest.x, st.bowlPos.y + c.rest.y, st.bowlPos.z + c.rest.z);
      }
      if (!visible) {
        m.compose(p, q, this.zero);
      } else {
        // the bag's own rotation applies to staged chips
        if (tau <= 0) qs.setFromRotationMatrix(st.pouchMatrix).multiply(q);
        else qs.copy(q);
        m.compose(p, qs, c.scale);
      }
      this.meshes[c.variant].setMatrixAt(c.slot, m);
    }
    for (const mesh of this.meshes) mesh.instanceMatrix.needsUpdate = true;
  }

  /** Count of chips that have landed — handy for UI captions. */
  landedFraction(s: number, fall: number) {
    let n = 0;
    for (const c of this.plans) if (s >= c.release + fall) n++;
    return n / this.plans.length;
  }

  dispose() {
    for (const g of this.geos) g.dispose();
    for (const mesh of this.meshes) mesh.dispose();
    this.material.map?.dispose();
    this.material.dispose();
  }
}
