import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111144);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ufoGroup = new THREE.Group();

const saucerGeometry = new THREE.CylinderGeometry(6, 6, 2, 64);
const saucerMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff, metalness: 0.8, roughness: 0.3 });
const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
saucer.castShadow = true;
ufoGroup.add(saucer);

const domeGeometry = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI);
const domeMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.8, roughness: 0.3 });
const dome = new THREE.Mesh(domeGeometry, domeMaterial);
dome.position.y = 1.5;
ufoGroup.add(dome);

for (let i = 0; i < 12; i++) {
  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const angle = (i / 12) * Math.PI * 2;
  lightSphere.position.set(Math.cos(angle) * 5.5, -1, Math.sin(angle) * 5.5);
  ufoGroup.add(lightSphere);
}

scene.add(ufoGroup);

const objectGeometry = new THREE.BoxGeometry(5, 2, 5);
const objectMaterial = new THREE.MeshStandardMaterial({ color: 0x8844ff });
const object = new THREE.Mesh(objectGeometry, objectMaterial);
object.position.set(0, -9, 0);
object.castShadow = true;
scene.add(object);

const spotlight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 4, 0.3, 1);
spotlight.position.set(0, -1.5, 0);
spotlight.target = object;
spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
ufoGroup.add(spotlight);
scene.add(spotlight.target);

const surroundingLight = new THREE.SpotLight(0x8888ff, 0.8, 150, Math.PI / 3, 0.5, 0.8);
surroundingLight.position.set(0, -5, 0);
surroundingLight.target = object;
surroundingLight.castShadow = true;
surroundingLight.shadow.mapSize.width = 1024;
surroundingLight.shadow.mapSize.height = 1024;
ufoGroup.add(surroundingLight);
scene.add(surroundingLight.target);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  ufoGroup.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
