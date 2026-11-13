/**
 * NapiExperience — the single WebGL scene behind the hero and the scroll story.
 *
 * Framework-agnostic on purpose: React only mounts it and feeds it a scroll
 * progress value. Every visual state is derived from that value (see
 * timeline.ts), which keeps the sequence deterministic and lets us skip
 * rendering entirely while nothing changes.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Bowl } from './bowl';
import { ChipSystem } from './chips';
import { ProceduralPouch, type PackageModel } from './pouch';
import {
  BEATS,
  buildChoreography,
  pourPose,
  sampleNum,
  seg,
  smooth,
  type Choreography,
  type Layout,
  type Vec3,
} from './timeline';

export interface EngineOptions {
  container: HTMLElement;
  textures: { front: string; back: string };
  reducedMotion: boolean;
  onReady?: () => void;
}

const FALL = 0.05; // fraction of the story each chip takes to fall

const detectLayout = (w: number, h: number): Layout => (w < 820 || w / h < 0.9 ? 'mobile' : 'desktop');

export class NapiExperience {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  private readonly container: HTMLElement;
  private readonly opts: EngineOptions;
  private readonly lowDetail: boolean;

  private pouch!: PackageModel;
  private bowl!: Bowl;
  private chips!: ChipSystem;
  private pmrem!: THREE.PMREMGenerator;
  private envTex!: THREE.Texture;
  private ground!: THREE.Mesh;
  private keyLight!: THREE.DirectionalLight;
  private textures: THREE.Texture[] = [];

  private layout: Layout;
  private choreo: Choreography;
  private progress = 0;
  private lastRendered = -1;
  private raf = 0;
  private running = false;
  private visible = true;
  private disposed = false;
  private readonly clock = new THREE.Clock();
  private readonly ro: ResizeObserver;
  private readonly io: IntersectionObserver;

  // scratch
  private readonly v3: Vec3 = [0, 0, 0];
  private readonly target = new THREE.Vector3();
  private readonly mouthWorld = new THREE.Vector3();
  private readonly exitDir = new THREE.Vector3();
  private readonly pourMatrix = new THREE.Matrix4();

  static isSupported(): boolean {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      return false;
    }
  }

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.container = opts.container;
    const { clientWidth: w, clientHeight: h } = this.container;
    this.layout = detectLayout(w, h);
    this.lowDetail = this.layout === 'mobile' || (navigator.hardwareConcurrency ?? 8) <= 4;
    this.choreo = buildChoreography(this.layout);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.lowDetail ? 1.5 : 1.75));
    this.renderer.setSize(w, h, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    this.container.appendChild(canvas);
    canvas.addEventListener('webglcontextlost', this.onContextLost);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.container);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.start();
    });
    this.io.observe(this.container);
  }

  /** Loads textures and builds the scene. Resolves after the first frame is on screen. */
  async init(): Promise<void> {
    const loader = new THREE.TextureLoader();
    const maxAniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const [front, back] = await Promise.all([
      loader.loadAsync(this.opts.textures.front),
      loader.loadAsync(this.opts.textures.back),
    ]);
    if (this.disposed) {
      front.dispose();
      back.dispose();
      return;
    }
    for (const t of [front, back]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      this.textures.push(t);
    }

    // Lighting: warm key, soft fill, cool rim + studio reflections
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.envTex = this.pmrem.fromScene(room, 0.04).texture;
    room.dispose?.();
    this.scene.environment = this.envTex;
    this.scene.environmentIntensity = 0.55;

    this.scene.add(new THREE.HemisphereLight(0xfff6e5, 0xd8cfb8, 0.55));
    this.keyLight = new THREE.DirectionalLight(0xfff1d6, 2.4);
    this.keyLight.position.set(3.5, 7.5, 5.5);
    this.keyLight.target.position.set(0, 0.8, 0);
    this.keyLight.castShadow = true;
    const sm = this.lowDetail ? 1024 : 2048;
    this.keyLight.shadow.mapSize.set(sm, sm);
    const sc = this.keyLight.shadow.camera;
    sc.left = -4;
    sc.right = 4;
    sc.top = 5;
    sc.bottom = -3;
    sc.near = 1;
    sc.far = 20;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.025;
    this.keyLight.shadow.radius = 4;
    this.scene.add(this.keyLight, this.keyLight.target);
    const rim = new THREE.DirectionalLight(0xdfeee0, 1.3);
    rim.position.set(-5, 4, -4.5);
    const fill = new THREE.DirectionalLight(0xfff8ec, 0.45);
    fill.position.set(-4, 2, 5);
    this.scene.add(rim, fill);

    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ color: 0x3a2f1a, opacity: 0.16, depthWrite: false }),
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    this.pouch = new ProceduralPouch(front, back, this.lowDetail);
    this.pouch.object.rotation.order = 'ZXY';
    this.scene.add(this.pouch.object);

    this.bowl = new Bowl(this.lowDetail);
    this.scene.add(this.bowl.object);

    const mobile = this.layout === 'mobile';
    this.chips = new ChipSystem(mobile ? 64 : 150, mobile ? 0.185 : 0.15, BEATS.pour, FALL);
    this.scene.add(this.chips.object);

    this.computePourFrame();
    this.resize();
    this.applyState(this.progress, 0);
    this.renderer.render(this.scene, this.camera);
    this.lastRendered = this.progress;
    this.opts.onReady?.();
    this.start();
  }

  /** The release point is evaluated once at the fixed pour pose → deterministic paths. */
  private computePourFrame() {
    const pose = pourPose(this.layout);
    const o = new THREE.Object3D();
    o.rotation.order = 'ZXY';
    o.position.set(...pose.pos);
    o.rotation.set(pose.roll, pose.yaw, pose.tilt);
    o.updateMatrixWorld(true);
    this.pourMatrix.copy(o.matrixWorld);
    this.pouch.getMouthLocal(this.mouthWorld).applyMatrix4(this.pourMatrix);
    this.exitDir.set(0, 1, 0).transformDirection(this.pourMatrix);
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
    this.start();
  }

  private start() {
    if (this.running || this.disposed || !this.pouch) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
  }

  private loop = () => {
    if (this.disposed) return;
    const s = this.progress;
    const floating = !this.opts.reducedMotion && s < 0.03;
    const changed = s !== this.lastRendered;
    if (this.visible && (changed || floating)) {
      this.applyState(s, this.clock.getElapsedTime());
      this.renderer.render(this.scene, this.camera);
      this.lastRendered = s;
    }
    if ((floating || changed) && this.visible) {
      this.raf = requestAnimationFrame(this.loop);
    } else {
      this.running = false; // idle: no frames are rendered until progress changes
    }
  };

  private applyState(s: number, time: number) {
    const c = this.choreo;
    const pouch = this.pouch.object;

    // ── package transform
    c.pouchPos.sample(s, this.v3);
    pouch.position.set(...this.v3);
    let yaw = sampleNum(c.pouchYaw, s);
    const floatW = this.opts.reducedMotion ? 0 : 1 - smooth(seg(s, 0, 0.03));
    if (floatW > 0) {
      pouch.position.y += Math.sin(time * 1.1) * 0.06 * floatW;
      yaw += Math.sin(time * 0.6) * 0.09 * floatW;
    }
    pouch.rotation.set(sampleNum(c.pouchRoll, s), yaw, sampleNum(c.pouchTilt, s) + Math.sin(time * 0.8) * 0.025 * floatW);
    pouch.updateMatrixWorld(true);

    // ── tear & open (vertex deformation on the real mesh)
    this.pouch.setTear(seg(s, ...BEATS.tear));
    this.pouch.setOpen(smooth(seg(s, ...BEATS.open)));
    this.pouch.setStripAway(seg(s, ...BEATS.stripAway));

    // ── bowl
    c.bowlPos.sample(s, this.v3);
    this.bowl.object.position.set(...this.v3);
    const bowlIn = smooth(seg(s, ...BEATS.bowlIn));
    this.bowl.object.visible = s >= BEATS.bowlIn[0];
    this.bowl.object.rotation.y = (1 - bowlIn) * 1.2; // a little turn as it slides in

    // ── chips
    this.chips.update({
      s,
      fallDuration: FALL,
      stageVisible: seg(s, ...BEATS.open) > 0.15,
      pouchMatrix: pouch.matrixWorld,
      mouthWorld: this.mouthWorld,
      exitDir: this.exitDir,
      bowlPos: this.bowl.object.position,
      interiorPoint: (a, b, d, out) => this.pouch.getInteriorPoint(a, b, d, out),
    });

    // ── camera
    c.camPos.sample(s, this.v3);
    this.camera.position.set(...this.v3);
    c.camTarget.sample(s, this.v3);
    this.target.set(...this.v3);
    if (floatW > 0) this.camera.position.x += Math.sin(time * 0.35) * 0.08 * floatW;
    this.camera.lookAt(this.target);
  }

  /** Renders the final composition (package + filled bowl) to an image for reuse elsewhere on the page. */
  snapshot(s = 1): string | null {
    if (!this.pouch || this.disposed) return null;
    try {
      this.applyState(s, 0);
      this.renderer.render(this.scene, this.camera);
      const url = this.renderer.domElement.toDataURL('image/webp', 0.92);
      this.applyState(this.progress, this.clock.getElapsedTime());
      this.renderer.render(this.scene, this.camera);
      return url;
    } catch {
      return null;
    }
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep framing on very wide or very tall screens
    this.camera.fov = w / h > 2 ? 26 : 30;
    this.camera.updateProjectionMatrix();
    const next = detectLayout(w, h);
    if (next !== this.layout) {
      this.layout = next;
      this.choreo = buildChoreography(next);
      if (this.pouch) this.computePourFrame();
    }
    this.lastRendered = -1;
    this.start();
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    console.warn('[Napi Organic] WebGL context lost');
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.pouch?.dispose();
    this.bowl?.dispose();
    this.chips?.dispose();
    if (this.ground) {
      this.ground.geometry.dispose();
      (this.ground.material as THREE.Material).dispose();
    }
    this.textures.forEach((t) => t.dispose());
    this.envTex?.dispose();
    this.pmrem?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
