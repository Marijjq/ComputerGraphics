import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const planeGeometry = new THREE.PlaneGeometry(26, 20);
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

const grass = new THREE.Mesh(planeGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.position.set(3, 0, 0); 
scene.add(grass);

const roadWidth = 2;
const road1Length = 20;
const road2Length = 15;
const road3Length = 26;
const road4Length = 13;

const road1Geometry = new THREE.PlaneGeometry(roadWidth, road1Length);
const road1 = new THREE.Mesh(road1Geometry, roadMaterial);
road1.rotation.x = -Math.PI / 2;
road1.position.y = 0.01;
scene.add(road1);

const road2Geometry = new THREE.PlaneGeometry(roadWidth, road2Length);
const road2 = new THREE.Mesh(road2Geometry, roadMaterial);
road2.rotation.x = -Math.PI / 2;
road2.rotation.z = Math.PI / 2;
road2.position.y = 0.02;
road2.position.set(-2.5, 0.02, 4);
scene.add(road2);

const road3Geometry = new THREE.PlaneGeometry(roadWidth, road3Length);
const road3 = new THREE.Mesh(road3Geometry, roadMaterial);
road3.rotation.x = -Math.PI / 2;
road3.rotation.z = Math.PI / 2;
road3.position.set(3, 0.02, 9);
scene.add(road3);

const road4Geometry = new THREE.PlaneGeometry(roadWidth, road4Length);
const road4 = new THREE.Mesh(road4Geometry, roadMaterial);
road4.rotation.x = -Math.PI / 2;
road4.rotation.z = 120 * (Math.PI / 180);
road4.position.set(10, 0.02, 0.9);
scene.add(road4);

const smallRoadWidth = 1; 
const smallRoadLength = 4;

const smallRoadGeometry = new THREE.PlaneGeometry(smallRoadWidth, smallRoadLength);
const smallRoad = new THREE.Mesh(smallRoadGeometry, roadMaterial);
smallRoad.rotation.x = -Math.PI / 2;
smallRoad.rotation.z = Math.PI / 2;
smallRoad.position.set(-2, 0.01, -2);
scene.add(smallRoad);

const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const building1Width = 6;
const building1Height = 1.5;
const building1Depth = 1.5;
const building1Geometry = new THREE.BoxGeometry(building1Width, building1Height, building1Depth);
const building1 = new THREE.Mesh(building1Geometry, whiteMaterial);
building1.position.set(-5, building1Height / 2, 6.5);
scene.add(building1);

const building2Width = 10;
const building2Height = 1.5;
const building2Depth = 1.5;
const building2Geometry = new THREE.BoxGeometry(building2Width, building2Height, building2Depth);
const building2 = new THREE.Mesh(building2Geometry, whiteMaterial);
building2.position.set(8, building2Height / 2, 6.5);
scene.add(building2);

const building3Geometry = new THREE.BoxGeometry(5, 1.5, 3);
const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const building3 = new THREE.Mesh(building3Geometry, blueMaterial);
building3.position.set(-5, 0.75, -2);
scene.add(building3);

const building4Width = 9;
const building4Height = 1.5;
const building4Depth = 2.5;
const building4Geometry = new THREE.BoxGeometry(building4Width, building4Height, building4Depth);
const building4 = new THREE.Mesh(building4Geometry, whiteMaterial);
building4.rotation.y = 30 * (Math.PI / 180);
building4.position.set(8, building4Height / 2, -2);
scene.add(building4);

const carGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 0.3, -road1Length / 2 + 1); 
scene.add(car);


gsap.timeline({ repeat: -1, yoyo: true })
  .to(car.position, { z: road1Length / 2 - 1, duration: 10, ease: "power1.inOut" }) 
  .to(car.position, { z: -road1Length / 2 + 1, duration: 10, ease: "power1.inOut" }); 



function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
