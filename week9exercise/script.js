import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);

const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xf7a8b8 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xd2a6f0 });
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xa2c9f4 });

const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;
box.position.set(-2, 0.5, 0);
scene.add(box);

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.set(0, 0.5, 0);
scene.add(sphere);

const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.castShadow = true;
cone.position.set(2, 0.5, 0);
scene.add(cone);

const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.6);
pointLight.position.set(-5, 5, -5);
pointLight.castShadow = true;
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 5, 5);
spotLight.target = sphere; // Spotlight will focus on the sphere
spotLight.castShadow = true;
scene.add(spotLight);

const controls = new OrbitControls(camera, renderer.domElement);

let boxSpeed = 0.02;
let sphereSpeed = 0.03;
let coneSpeed = 0.04;

function onDocumentClick(event) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([box, sphere, cone]);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(Math.random() * 0xcccccc);
    }
}

document.addEventListener('click', onDocumentClick);

camera.position.set(0, 5, 10);
controls.update();

function animate() {
    requestAnimationFrame(animate);

    box.position.x += boxSpeed;
    sphere.position.x += sphereSpeed;
    cone.position.x += coneSpeed;

    if (box.position.x > 5 || box.position.x < -5) {
        boxSpeed = -boxSpeed;
    }
    if (sphere.position.x > 5 || sphere.position.x < -5) {
        sphereSpeed = -sphereSpeed;
    }
    if (cone.position.x > 5 || cone.position.x < -5) {
        coneSpeed = -coneSpeed;
    }

    renderer.render(scene, camera);
}

animate();
