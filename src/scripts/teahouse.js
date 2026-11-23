import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

export async function showTeahouse(viewport) {
  const assets = "/teahouse-assets/";
  const response = await fetch(assets + "scene.json");
  if (!response.ok) throw new Error(`Tea house scene request failed: ${response.status}`);
  const { west, east, back, front, floor, ceiling, thickness, window, plaque, tabletop, shelf, teaware, furniture, planting } =
    await response.json();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  viewport.append(renderer.domElement);
  scene.add(new SparkRenderer({ renderer, blurAmount: .20 }));

  const centerX = (west + east) / 2;
  const centerZ = (back + front) / 2;
  const centerY = (floor + ceiling) / 2;
  const width = east - west;
  const depth = front - back;
  const height = ceiling - floor;
  const finish = new THREE.MeshBasicMaterial({ color: 0xa98864 });
  const manager = new THREE.LoadingManager();
  const texturesReady = new Promise((resolve, reject) => {
    manager.onLoad = resolve;
    manager.onError = url => reject(new Error(`Tea house texture failed to load: ${url}`));
  });
  const loader = new THREE.TextureLoader(manager);
  const material = id => {
    const map = loader.load(`${assets}textures/${id}.jpg`);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return new THREE.MeshBasicMaterial({ map });
  };
  const add = (geometry, material, position, pitch = 0, yaw = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(pitch, yaw, 0);
    scene.add(mesh);
  };

  const floorFaces = Array(6).fill(finish);
  floorFaces[2] = material("floor");
  add(new THREE.BoxGeometry(width + thickness, thickness, depth + thickness), floorFaces,
      [centerX - thickness / 2, floor - thickness / 2, centerZ - thickness / 2]);
  const frontFaces = Array(6).fill(finish);
  frontFaces[4] = material("back");
  add(new THREE.BoxGeometry(width, height, thickness), frontFaces,
      [centerX, centerY, back - thickness / 2]);
  const sideFaces = Array(6).fill(finish);
  sideFaces[0] = material("side");
  add(new THREE.BoxGeometry(thickness, height, depth + thickness), sideFaces,
      [west - thickness / 2, centerY, centerZ - thickness / 2]);

  const [windowZ, windowY, radius] = window;
  const wood = material("wood");
  // The frame and garden share a circular plane facing the side camera.
  add(new THREE.CircleGeometry(radius, 144), material("window"), [west + .022, windowY, windowZ], 0, Math.PI / 2);
  const frame = new THREE.Shape();
  frame.absarc(0, 0, radius + .043, 0, 2 * Math.PI, false);
  const opening = new THREE.Path();
  opening.absarc(0, 0, radius, 0, 2 * Math.PI, true);
  frame.holes.push(opening);
  add(new THREE.ExtrudeGeometry(frame, { depth: .029, bevelEnabled: true, bevelSize: .005,
    bevelThickness: .005, bevelSegments: 2, curveSegments: 72 }),
    new THREE.MeshBasicMaterial({ map: wood.map, color: 0x99754d }),
    [west + .004, windowY, windowZ], 0, Math.PI / 2);

  const [plaqueX, plaqueY, plaqueWidth, plaqueHeight] = plaque;
  const plaqueFaces = Array(6).fill(wood);
  plaqueFaces[4] = material("plaque");
  add(new THREE.BoxGeometry(plaqueWidth, plaqueHeight, .055), plaqueFaces, [plaqueX, plaqueY, back + .028]);

  const topFinish = material("table");
  const tableFace = (corners, surface, uv, indices) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(corners.flat(), 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    add(geometry, surface, [0, 0, 0]);
  };
  const topUV = [0, 1, 1, 1, 1, 0, 0, 0];
  tableFace(tabletop[0], topFinish, topUV, [0, 2, 1, 0, 3, 2]);
  tableFace(tabletop[3], new THREE.MeshBasicMaterial({ map: topFinish.map, color: 0xbeb0a3 }),
    topUV, [0, 1, 2, 0, 2, 3]);
  for (let edge = 0; edge < 4; edge++) {
    const next = (edge + 1) % 4;
    const corners = tabletop.flatMap(ring => [ring[edge], ring[next]]);
    const uv = [1, 62/70, 8/70, 0].flatMap(v => [0, v, 1, v]);
    tableFace(corners, material(`table-edge-${edge}`), uv,
      [0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6, 5, 7, 6]);
  }

  const modelMaterials = new Map();
  const plantBreeze = { value: 0 };
  const potteryRelief = material("tea-bump").map;
  potteryRelief.colorSpace = THREE.NoColorSpace;
  scene.add(new THREE.HemisphereLight(0xfff2e5, 0xc59a7c, 1.42));
  const teaKey = new THREE.DirectionalLight(0xffebd7, 2.18);
  teaKey.position.set(-2.6, 3.0, 4.2);
  scene.add(teaKey);
  const teaFill = new THREE.DirectionalLight(0xfff2e2, .74);
  teaFill.position.set(2.3, 1.6, -1.5);
  scene.add(teaFill);
  for (const [name, positions, uv, indices] of [...shelf, ...teaware, ...furniture, ...planting]) {
    const pottery = name.startsWith("tea-") && !name.startsWith("tea-tray-");
    const leather = name.startsWith("bench-leather");
    const stone = name === "support-stone" || name === "garden-stone";
    const rootstock = name.startsWith("fern-rootstock");
    const fern = name === "fern-stem" || name.startsWith("fern-leaf-");
    const grass = name.startsWith("grass-blade-");
    const sculpted = stone || rootstock || name === "bench-frame" || leather || name === "chair-rail" || name === "chair-frame" || name.startsWith("bonsai-bark");
    if (!modelMaterials.has(name)) {
      const baked = material(name);
      const copper = name === "tea-brass";
      const gardenRelief = name === "garden-stone" ? material("garden-stone-bump").map : null;
      if (gardenRelief) gardenRelief.colorSpace = THREE.NoColorSpace;
      const surface = pottery ? new THREE.MeshPhysicalMaterial({
        map: baked.map,
        roughness: copper ? .34 : .53,
        metalness: copper ? .32 : 0,
        clearcoat: copper ? .25 : .14,
        clearcoatRoughness: .39,
        bumpMap: copper ? null : potteryRelief,
        bumpScale: .00036,
      }) : sculpted ? new THREE.MeshPhysicalMaterial({
        map: baked.map, roughness: stone ? .94 : rootstock ? .82 : leather ? .64 : .55,
        clearcoat: stone ? 0 : name === "chair-rail" ? .3 : .05, clearcoatRoughness: .38,
        bumpMap: gardenRelief, bumpScale: .0042,
      }) : baked;
      if (fern || grass) {
        surface.onBeforeCompile = shader => {
          shader.uniforms.plantBreeze = plantBreeze;
          shader.uniforms.plantBend = { value: grass ? new THREE.Vector3(-.312,-.145,.40)
                                                      : new THREE.Vector3(-.116,.72,1) };
          shader.vertexShader = "uniform float plantBreeze;\nuniform vec3 plantBend;\n"
            + shader.vertexShader.replace("#include <begin_vertex>", `
            #include <begin_vertex>
            float height = smoothstep(plantBend.x, plantBend.y, position.y) * plantBend.z;
            float sway = sin(plantBreeze + position.z * 1.5 + position.x);
            transformed += height * vec3(0.014 * sway, 0.003 * sway, 0.019 * sway);
          `);
        };
      }
      surface.side = THREE.DoubleSide;
      modelMaterials.set(name, surface);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    if (pottery || sculpted) geometry.computeVertexNormals();
    add(geometry, modelMaterials.get(name), [0, 0, 0]);
  }

  const room = new SplatMesh({ url: assets + "room.spz", raycastable: false });
  await Promise.all([room.initialized, texturesReady]);
  scene.add(room);

  const camera = new THREE.PerspectiveCamera(36, 1, .03, 80);
  camera.position.set(-.52, 1.43, -.52);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(-3.18, .30, -5.75);
  controls.cursor.copy(controls.target);
  controls.maxTargetRadius = 1.25;
  controls.enableDamping = true;
  controls.enableZoom = false;
  renderer.domElement.addEventListener("wheel", event => {
    if (event.ctrlKey) event.preventDefault();
  }, { passive: false });
  controls.update();

  function resize() {
    renderer.setSize(viewport.clientWidth, viewport.clientHeight, false);
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.max(1, 1.33 / camera.aspect)
      * Math.tan(THREE.MathUtils.degToRad(36 / 2))));
    camera.updateProjectionMatrix();
  }

  resize();
  new ResizeObserver(resize).observe(viewport);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  renderer.setAnimationLoop(time => {
    plantBreeze.value = reducedMotion.matches ? 0 : (time % 5600) * Math.PI / 2800;
    controls.update();
    renderer.render(scene, camera);
  });
  renderer.render(scene, camera);
  viewport.dataset.ready = "";
}
