/**
 * Hand-thrown stoneware bowl: cream glaze inside, forest-green glaze outside,
 * unglazed speckled rim and foot. Built with a lathe so the inner surface is
 * analytically known — chips are stacked against it deterministically.
 */
import * as THREE from 'three';

export const BOWL = {
  innerRadius: 0.98, // at rim
  innerDepth: 0.52,
  rimY: 0.62,
  outerRadius: 1.045,
  outerDepth: 0.56,
};

/** Inner surface radius at height y (ellipsoidal cavity). */
export function bowlInnerRadius(y: number): number {
  const d = (BOWL.rimY - y) / BOWL.innerDepth;
  if (d >= 1) return 0;
  if (d <= 0) return BOWL.innerRadius;
  return BOWL.innerRadius * Math.sqrt(1 - d * d);
}

/** Height of the inner surface at radius r. */
export function bowlInnerY(r: number): number {
  const q = Math.min(0.999, r / BOWL.innerRadius);
  return BOWL.rimY - BOWL.innerDepth * Math.sqrt(1 - q * q);
}

/** Slope angle (radians) of the inner wall at radius r. */
export function bowlInnerSlope(r: number): number {
  const a = BOWL.innerRadius;
  const q = Math.min(0.97, r / a);
  const dydr = (BOWL.innerDepth * (q / a)) / Math.sqrt(1 - q * q);
  return Math.atan(dydr);
}

function profile(): { points: THREE.Vector2[]; bands: number[] } {
  const pts: THREE.Vector2[] = [];
  const steps = 18;
  // inner cavity: bottom centre → rim
  for (let i = 0; i <= steps; i++) {
    const phi = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(0.001, BOWL.innerRadius * Math.sin(phi)), BOWL.rimY - BOWL.innerDepth * Math.cos(phi)));
  }
  const innerEnd = pts.length - 1;
  // rounded rim
  pts.push(new THREE.Vector2(0.995, 0.638), new THREE.Vector2(1.022, 0.642), new THREE.Vector2(1.042, 0.628));
  const rimEnd = pts.length - 1;
  // outer wall: rim → foot
  const phiFoot = Math.asin(0.5 / BOWL.outerRadius);
  for (let i = 1; i <= steps; i++) {
    const phi = Math.PI / 2 - (i / steps) * (Math.PI / 2 - phiFoot);
    pts.push(new THREE.Vector2(BOWL.outerRadius * Math.sin(phi), BOWL.rimY - BOWL.outerDepth * Math.cos(phi)));
  }
  const outerEnd = pts.length - 1;
  // foot ring and underside
  pts.push(
    new THREE.Vector2(0.485, 0.07),
    new THREE.Vector2(0.47, 0.008),
    new THREE.Vector2(0.44, 0.0),
    new THREE.Vector2(0.4, 0.004),
    new THREE.Vector2(0.38, 0.035),
    new THREE.Vector2(0.001, 0.05),
  );
  const n = pts.length - 1;
  return { points: pts, bands: [innerEnd / n, rimEnd / n, outerEnd / n] };
}

function bowlTextures(bands: number[]) {
  const size = 512;
  const color = document.createElement('canvas');
  color.width = color.height = size;
  const rough = document.createElement('canvas');
  rough.width = rough.height = size;
  const c = color.getContext('2d')!;
  const r = rough.getContext('2d')!;
  // canvas y=0 is the top of the image; lathe v=0 (bottom centre) maps to the image bottom (flipY)
  const yOf = (v: number) => size * (1 - v);
  const [innerEnd, rimEnd, outerEnd] = bands;

  const g = c.createLinearGradient(0, yOf(0), 0, yOf(innerEnd));
  g.addColorStop(0, '#efe7d6');
  g.addColorStop(1, '#f6f0e3');
  c.fillStyle = g;
  c.fillRect(0, yOf(innerEnd), size, yOf(0) - yOf(innerEnd));
  c.fillStyle = '#cdb898'; // unglazed rim
  c.fillRect(0, yOf(rimEnd + 0.012), size, yOf(innerEnd - 0.01) - yOf(rimEnd + 0.012));
  const og = c.createLinearGradient(0, yOf(rimEnd), 0, yOf(outerEnd));
  og.addColorStop(0, '#2c5a3f');
  og.addColorStop(0.55, '#244b35');
  og.addColorStop(1, '#1b3a29');
  c.fillStyle = og;
  c.fillRect(0, yOf(outerEnd), size, yOf(rimEnd + 0.012) - yOf(outerEnd));
  c.fillStyle = '#c8b291'; // unglazed foot
  c.fillRect(0, 0, size, yOf(outerEnd - 0.005));
  // glaze drips running onto the bare foot
  c.fillStyle = '#1d3d2b';
  for (let x = 0; x < size; x += 6) {
    const h = 4 + 12 * Math.abs(Math.sin(x * 0.13) * Math.sin(x * 0.041));
    c.fillRect(x, yOf(outerEnd) - h, 6, h + 1);
  }
  // iron speckles everywhere
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) {
    c.fillStyle = `rgba(${60 + rand() * 40},${40 + rand() * 25},${25 + rand() * 15},${0.25 + rand() * 0.5})`;
    const s = 0.6 + rand() * 1.6;
    c.fillRect(rand() * size, rand() * size, s, s);
  }
  // roughness: glaze glossy, bare clay matte
  r.fillStyle = '#4a4a4a';
  r.fillRect(0, 0, size, size);
  r.fillStyle = '#e0e0e0';
  r.fillRect(0, yOf(rimEnd + 0.012), size, yOf(innerEnd - 0.01) - yOf(rimEnd + 0.012));
  r.fillRect(0, 0, size, yOf(outerEnd - 0.005));

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  const roughnessMap = new THREE.CanvasTexture(rough);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  return { map, roughnessMap };
}

export class Bowl {
  readonly object = new THREE.Group();
  private readonly geo: THREE.LatheGeometry;
  private readonly mat: THREE.MeshPhysicalMaterial;

  constructor(lowDetail = false) {
    const { points, bands } = profile();
    this.geo = new THREE.LatheGeometry(points, lowDetail ? 48 : 96);
    const { map, roughnessMap } = bowlTextures(bands);
    this.mat = new THREE.MeshPhysicalMaterial({
      map,
      roughnessMap,
      roughness: 1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.18,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(this.geo, this.mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.object.add(mesh);
  }

  dispose() {
    this.geo.dispose();
    this.mat.map?.dispose();
    this.mat.roughnessMap?.dispose();
    this.mat.dispose();
  }
}
