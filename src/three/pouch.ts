/**
 * Procedural stand-up pouch with a real tear-off top.
 *
 * The pouch is built from two textured panels (front/back) whose vertices are
 * displaced into a pillow shape, plus an oval gusset base. The panels are split
 * along a jagged tear line into:
 *   • body  — stays, its mouth is opened by vertex deformation (`setOpen`)
 *   • strip — the top seal, peels away from the notch side (`setTear`)
 * Outer surfaces carry the actual Napi Organic artwork; inner surfaces are
 * metallised foil, so opening the bag reveals a real interior.
 *
 * Implements `PackageModel` so it can be swapped for a professional GLB later
 * (see docs/3D-ASSETS.md).
 */
import * as THREE from 'three';
import { clamp01, easeOutCubic, smooth } from './timeline';

export interface PackageModel {
  readonly object: THREE.Object3D;
  /** Package height in world units (bottom of the gusset to top seal). */
  readonly height: number;
  /** 0 = sealed, 1 = top strip fully detached */
  setTear(t: number): void;
  /** 0 = closed mouth, 1 = fully opened */
  setOpen(t: number): void;
  /** 0..1 — strip flies out of frame after detaching */
  setStripAway(t: number): void;
  /** Point at the centre of the mouth, in the package's local space. */
  getMouthLocal(target: THREE.Vector3): THREE.Vector3;
  /** Random point inside the bag near the mouth (local space), used to stage chips. */
  getInteriorPoint(r1: number, r2: number, r3: number, target: THREE.Vector3): THREE.Vector3;
  dispose(): void;
}

export const POUCH = {
  width: 1.3,
  height: 2.25,
  depth: 0.34, // half-thickness of the base gusset
};

const TEAR_V_BASE = 0.845;
/** Jagged tear line (fraction of height) as a function of horizontal position u ∈ [0,1]. */
const tearV = (u: number) =>
  TEAR_V_BASE +
  0.006 * Math.sin(u * 41.0) +
  0.004 * Math.sin(u * 97.0 + 1.3) +
  0.0025 * Math.sin(u * 203.0 + 0.4);

/** Pillow bulge (half thickness) at (u, v). */
function bulge(u: number, v: number): number {
  const across = Math.pow(Math.sin(Math.PI * u), 0.55);
  const taperTop = 1 - smooth(clamp01((v - 0.5) / 0.42)); // flat seal at the top
  const base = 0.78 + 0.22 * (1 - v);
  // gentle film wrinkles so it reads as flexible packaging
  const wrinkle = 0.012 * Math.sin(u * 19 + v * 7) * Math.sin(v * 23 + 1.7) * (1 - v * 0.6);
  return POUCH.depth * across * taperTop * base + wrinkle * across * taperTop + 0.004 * across;
}

/** Mouth-opening displacement (added to bulge) */
function mouth(u: number, v: number): number {
  return 0.3 * Math.pow(Math.sin(Math.PI * u), 0.75) * smooth(clamp01((v - 0.42) / 0.42));
}

interface PanelBuffers {
  geo: THREE.BufferGeometry;
  /** rest data per vertex: u, v */
  uv0: Float32Array;
}

/**
 * Builds a panel grid. `side` = +1 front (faces +Z), −1 back (faces −Z).
 * `vFrom/vTo` are functions of u so panels follow the jagged tear.
 */
function buildPanel(
  side: 1 | -1,
  segU: number,
  segV: number,
  vFrom: (u: number) => number,
  vTo: (u: number) => number,
): PanelBuffers {
  const cols = segU + 1;
  const rows = segV + 1;
  const pos = new Float32Array(cols * rows * 3);
  const uv = new Float32Array(cols * rows * 2);
  const uv0 = new Float32Array(cols * rows * 2);
  const idx: number[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const u = i / segU;
      const t = j / segV;
      const v = vFrom(u) + (vTo(u) - vFrom(u)) * t;
      const k = j * cols + i;
      uv0[k * 2] = u;
      uv0[k * 2 + 1] = v;
      // back panel is seen from behind: mirror horizontally so artwork reads correctly
      uv[k * 2] = side === 1 ? u : 1 - u;
      uv[k * 2 + 1] = v;
      pos[k * 3] = 0;
      pos[k * 3 + 1] = 0;
      pos[k * 3 + 2] = 0;
    }
  }
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      if (side === 1) idx.push(a, b, d, a, d, c);
      else idx.push(a, d, b, a, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return { geo, uv0 };
}

export class ProceduralPouch implements PackageModel {
  readonly object = new THREE.Group();
  readonly height = POUCH.height;

  private readonly body = new THREE.Group();
  private readonly strip = new THREE.Group();
  private readonly stripPivot = new THREE.Group();
  private panels: { buf: PanelBuffers; side: 1 | -1; isStrip: boolean }[] = [];
  private baseGeo!: THREE.BufferGeometry;
  private readonly disposables: { dispose(): void }[] = [];
  private tear = -1;
  private open = -1;
  private away = 0;

  constructor(frontTex: THREE.Texture, backTex: THREE.Texture, lowDetail = false) {
    const segU = lowDetail ? 22 : 34;
    const segBody = lowDetail ? 34 : 54;
    const segStrip = 6;

    const outer = (map: THREE.Texture) =>
      new THREE.MeshPhysicalMaterial({
        map,
        roughness: 0.42,
        metalness: 0.0,
        clearcoat: 0.55,
        clearcoatRoughness: 0.32,
        side: THREE.FrontSide,
      });
    const frontMat = outer(frontTex);
    const backMat = outer(backTex);
    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xd9d6cf,
      metalness: 0.85,
      roughness: 0.32,
      side: THREE.BackSide,
    });
    const gussetMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b6a2a,
      roughness: 0.45,
      clearcoat: 0.4,
      side: THREE.DoubleSide,
    });
    this.disposables.push(frontMat, backMat, foilMat, gussetMat);

    const bodyFrom = () => 0;
    const stripTo = () => 1;
    const sides: (1 | -1)[] = [1, -1];
    for (const side of sides) {
      const bodyBuf = buildPanel(side, segU, segBody, bodyFrom, tearV);
      const stripBuf = buildPanel(side, segU, segStrip, tearV, stripTo);
      this.panels.push({ buf: bodyBuf, side, isStrip: false }, { buf: stripBuf, side, isStrip: true });
      const mat = side === 1 ? frontMat : backMat;
      for (const [buf, parent] of [
        [bodyBuf, this.body],
        [stripBuf, this.strip],
      ] as const) {
        const outerMesh = new THREE.Mesh(buf.geo, mat);
        const innerMesh = new THREE.Mesh(buf.geo, foilMat);
        outerMesh.castShadow = true;
        outerMesh.receiveShadow = true;
        parent.add(outerMesh, innerMesh);
        this.disposables.push(buf.geo);
      }
    }

    // Oval gusset base (fan between the bottom rows of front & back)
    this.baseGeo = new THREE.BufferGeometry();
    const n = segU + 1;
    this.baseGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3));
    const bIdx: number[] = [];
    for (let i = 0; i < segU; i++) {
      const f0 = i;
      const f1 = i + 1;
      const b0 = n + i;
      const b1 = n + i + 1;
      bIdx.push(f0, b0, f1, f1, b0, b1);
    }
    this.baseGeo.setIndex(bIdx);
    const base = new THREE.Mesh(this.baseGeo, gussetMat);
    base.castShadow = true;
    this.body.add(base);
    this.disposables.push(this.baseGeo);

    // The strip hinges at its left end (u = 0): the tear starts at the notch on the right.
    const hingeX = -POUCH.width / 2;
    const hingeY = (TEAR_V_BASE - 0.5) * POUCH.height;
    this.stripPivot.position.set(hingeX, hingeY, 0);
    this.strip.position.set(-hingeX, -hingeY, 0);
    this.stripPivot.add(this.strip);

    this.object.add(this.body, this.stripPivot);
    this.setTear(0);
    this.setOpen(0);
  }

  /** Writes vertex positions for every panel for the current `open` amount. */
  private rebuild(open: number) {
    const W = POUCH.width;
    const H = POUCH.height;
    for (const { buf, side, isStrip } of this.panels) {
      const posAttr = buf.geo.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const count = arr.length / 3;
      for (let k = 0; k < count; k++) {
        const u = buf.uv0[k * 2];
        const v = buf.uv0[k * 2 + 1];
        const o = isStrip ? 0 : open * mouth(u, v);
        // pinch the sides inwards a little as the mouth opens & towards the base
        const pinch = 1 - 0.07 * open * smooth(clamp01((v - 0.5) / 0.4)) - 0.035 * Math.pow(1 - v, 3);
        arr[k * 3] = (u - 0.5) * W * pinch;
        arr[k * 3 + 1] = (v - 0.5) * H;
        arr[k * 3 + 2] = side * (bulge(u, v) + o);
      }
      posAttr.needsUpdate = true;
      buf.geo.computeVertexNormals();
      buf.geo.computeBoundingSphere();
    }
    // gusset follows the bottom rows of the two body panels
    const front = this.panels.find((p) => p.side === 1 && !p.isStrip)!.buf.geo.getAttribute('position');
    const back = this.panels.find((p) => p.side === -1 && !p.isStrip)!.buf.geo.getAttribute('position');
    const basePos = this.baseGeo.getAttribute('position') as THREE.BufferAttribute;
    const n = basePos.count / 2;
    for (let i = 0; i < n; i++) {
      basePos.setXYZ(i, front.getX(i), front.getY(i), front.getZ(i));
      basePos.setXYZ(n + i, back.getX(i), back.getY(i), back.getZ(i));
    }
    basePos.needsUpdate = true;
    this.baseGeo.computeVertexNormals();
    this.baseGeo.computeBoundingSphere();
  }

  setOpen(t: number) {
    const v = Math.round(clamp01(t) * 200) / 200; // quantise: skip redundant rebuilds
    if (v === this.open) return;
    this.open = v;
    this.rebuild(v);
  }

  setTear(t: number) {
    const v = clamp01(t);
    if (v === this.tear) return;
    this.tear = v;
    this.applyStrip();
  }

  setStripAway(t: number) {
    this.away = clamp01(t);
    this.applyStrip();
  }

  private applyStrip() {
    const t = easeOutCubic(this.tear);
    // peel: right end lifts first, curling up & back around the left hinge
    this.stripPivot.rotation.set(-0.35 * t, 0.25 * t, 0.62 * t);
    const a = this.away;
    const fly = a * a;
    this.stripPivot.position.set(
      -POUCH.width / 2 + fly * 2.6 + 0.08 * t,
      (TEAR_V_BASE - 0.5) * POUCH.height + 0.06 * t + fly * 2.2,
      fly * 1.4,
    );
    this.stripPivot.rotation.z += fly * 2.4;
    this.stripPivot.rotation.x -= fly * 1.1;
    this.stripPivot.visible = a < 0.999;
  }

  getMouthLocal(target: THREE.Vector3) {
    return target.set(0, (TEAR_V_BASE - 0.5) * POUCH.height, 0);
  }

  getInteriorPoint(r1: number, r2: number, r3: number, target: THREE.Vector3) {
    const u = 0.2 + 0.6 * r1;
    const v = 0.52 + 0.28 * r2;
    const half = (bulge(u, v) + Math.max(0, this.open) * mouth(u, v)) * 0.55;
    return target.set((u - 0.5) * POUCH.width * 0.92, (v - 0.5) * POUCH.height, (r3 * 2 - 1) * half);
  }

  dispose() {
    for (const d of this.disposables) d.dispose();
    this.disposables.length = 0;
  }
}
