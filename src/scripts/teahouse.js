import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { dyno, SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

export async function showTeahouse(viewport, seat, openGuide) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.05, 120);
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x211712);
  viewport.appendChild(renderer.domElement);

  scene.add(new SparkRenderer({ renderer }));
  // Extend the room behind the tea table with surfaces textured from the source view.
  const [floorTexture, plasterTexture] = ["floor", "plaster"].map(name => {
    const texture = new THREE.TextureLoader().load(`/teahouse-assets/${name}.jpg`);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  });
  // Preserve the original tile scale along the extended right and back edges.
  floorTexture.repeat.set(4.8 * (20 / 8.2), 7.2 * (24 / 11.7));
  plasterTexture.repeat.set(4.4, 3.4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 24), new THREE.MeshBasicMaterial({ map: floorTexture }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(5.9, -0.045, -9.55);
  scene.add(floor);
  const plaster = new THREE.MeshBasicMaterial({ map: plasterTexture, side: THREE.DoubleSide });
  for (const [width, x, z, yaw] of [
    [8.4, -3.65, -1.8, Math.PI / 2],
    [7.8,  3.7,  -1.5, -Math.PI / 2],
    [7.35, 0.025, 2.4, Math.PI],
  ]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(width, 4.15), plaster);
    wall.position.set(x, 2.03, z);
    wall.rotation.y = yaw;
    scene.add(wall);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.touches.TWO = null;
  controls.minPolarAngle = 1.27;
  controls.maxPolarAngle = 1.53;
  controls.minAzimuthAngle = -0.28;
  controls.maxAzimuthAngle = 0.28;
  camera.position.set(0, 2.52, 0.65);
  controls.target.set(0, 1.03, -6.95);

  const [room, foliage] = ["world", "foliage"].map(name =>
    new SplatMesh({ url: `/teahouse-assets/${name}.spz`, raycastable: false }),
  );
  await Promise.all([room.initialized, foliage.initialized]);

  // Animate just the selected leaf and stem splats. Height keeps the base
  // anchored, and phase varies along the canopy so the fronds sway separately.
  const breeze = dyno.dynoFloat(0);
  foliage.objectModifier = dyno.dynoBlock({ gsplat: dyno.Gsplat }, { gsplat: dyno.Gsplat }, ({ gsplat }) =>
    new dyno.Dyno({
      inTypes: { gsplat: dyno.Gsplat, time: "float" },
      outTypes: { gsplat: dyno.Gsplat },
      statements: ({ inputs, outputs }) => [`
        ${outputs.gsplat} = ${inputs.gsplat};
        vec3 leaf = ${inputs.gsplat}.center;
        float weight = smoothstep(0.95, 1.77, leaf.y);
        float phase = ${inputs.time} + 1.5 * leaf.z + leaf.x;
        float sway = sin(phase) + 0.23 * sin(2.0 * phase + 0.6);
        ${outputs.gsplat}.center += weight * vec3(
          0.023 * sway, 0.008 * sin(phase - 0.65), 0.015 * sin(phase + 0.8)
        );
      `],
    }).apply({ gsplat, time: breeze }),
  );
  foliage.updateGenerator();
  scene.add(room, foliage);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  // Position and orientation measured from the bench in the Atlas depth frame.
  const bench = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.68, 0.35));
  bench.position.set(-0.36, 0.34, -6.04);
  bench.rotation.y = -0.3;
  bench.updateMatrixWorld();
  const labelPosition = new THREE.Vector3(-0.36, 0.85, -6.04);
  const projected = new THREE.Vector3();
  const positionLabel = () => {
    projected.copy(labelPosition).project(camera);
    seat.style.left = `${(projected.x + 1) * 50}%`;
    seat.style.top = `${(1 - projected.y) * 50}%`;
  };
  controls.addEventListener("change", positionLabel);
  const resize = () => {
    const { clientWidth, clientHeight } = viewport;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    const portrait = THREE.MathUtils.smoothstep(1 - camera.aspect, 0, 0.55);
    const targetX = -0.85 * portrait;
    camera.position.x += targetX - controls.target.x;
    controls.target.x = targetX;
    camera.fov = 31 + 12 * portrait;
    camera.updateProjectionMatrix();
    controls.update();
    positionLabel();
  };
  new ResizeObserver(resize).observe(viewport);
  resize();

  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitsBench = (event) => {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    pointer.set(2 * (event.clientX - left) / width - 1, 1 - 2 * (event.clientY - top) / height);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(bench).length > 0;
  };

  let press;
  canvas.addEventListener("pointerdown", event => {
    if (event.isPrimary && event.button === 0) {
      press = { x: event.clientX, y: event.clientY, moved: false, onBench: hitsBench(event) };
    } else {
      press = undefined;
    }
  });
  canvas.addEventListener("pointermove", event => {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) {
      press.moved = true;
    }
    canvas.toggleAttribute("data-over-seat", !event.buttons && hitsBench(event));
  });
  canvas.addEventListener("pointerup", event => {
    if (press?.onBench && !press.moved && hitsBench(event)) openGuide();
    press = undefined;
  });
  canvas.addEventListener("pointercancel", () => { press = undefined; });

  renderer.setAnimationLoop(time => {
    const phase = reducedMotion.matches ? 0 : (time % 5600) * Math.PI / 2800;
    if (phase !== breeze.value) {
      breeze.value = phase;
      foliage.updateVersion();
    }
    controls.update();
    renderer.render(scene, camera);
    if (!viewport.dataset.ready) viewport.dataset.ready = "true";
  });
}
