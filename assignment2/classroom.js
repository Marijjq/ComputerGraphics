import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 2, 3);

// textures
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('textures/Poliigon_PlasticMoldDryBlast_7495_Roughness.jpg');
const wallTexture = textureLoader.load('textures/beige_wall_001_diff_4k.jpg');
const windowTexture = textureLoader.load('textures/preview16.jpg');

const materials = [
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // right wall
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // left wall
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // top
    new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.BackSide }), // bottom (floor)
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // front wall
    new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide })  // back wall
];

// box
const geometry = new THREE.BoxGeometry(10, 5, 10);
const classroom = new THREE.Mesh(geometry, materials);
scene.add(classroom);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, depthTest: false,  });
const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
scene.add(cubeEdges);

 // lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const loader = new GLTFLoader();

// 3D models for the classroom
function loadModel(path, position, scale = new THREE.Vector3(1, 1, 1), rotation = new THREE.Euler(), flipX = false,flipY=false, flipZ = false) {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(position.x, position.y, position.z);
        model.scale.set(scale.x, scale.y, scale.z);
        model.rotation.set(rotation.x, rotation.y, rotation.z);

        if (flipX) model.scale.x *= -1;
        if (flipY) model.scale.y *= -1;
        if (flipZ) model.scale.z *= -1;
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    });
}

const deskPositions = [
    [-2, -2.5, -1], [2, -2.5, -1], [-2, -2.5, 2], [2, -2.5, 2]
];
deskPositions.forEach(pos => loadModel('3Dmodels/school_desk.glb', new THREE.Vector3(...pos)));

const chairPositions = [
    [-2.5, -2.5, -0.5], [-1.5, -2.5, -0.5], [1.5, -2.5, -0.5], [2.5, -2.5, -0.5],
    [-2.5, -2.5, 2.5], [-1.5, -2.5, 2.5], [2.5, -2.5, 2.5], [1.5, -2.5, 2.5]
];
chairPositions.forEach(pos => loadModel('3Dmodels/school_chair.glb', new THREE.Vector3(...pos), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), false,false, true));

const windowPositions = [
    [5, -1, -3], [5, -1, 3]
];
windowPositions.forEach(pos => loadModel('3Dmodels/residential_window.glb', new THREE.Vector3(...pos), new THREE.Vector3(1.5, 1.5, 1.5), new THREE.Euler(0, -Math.PI / 2, 0)));

const lightPositions = [
    [1, 2.5, -2],
    [-3, 2.5, -2],
    [1, 2.5, 2],
    [-3, 2.5, 2]
];

lightPositions.forEach(pos => loadModel('3Dmodels/lights.glb', new THREE.Vector3(...pos), new THREE.Vector3(0.02, 0.02, 0.02), new THREE.Euler(0, 0, 0), false,true, false));

loadModel('3Dmodels/classroom_door.glb', new THREE.Vector3(-0.8, -2.8, 5), new THREE.Vector3(2.5, 2.5, 2.5), new THREE.Euler(0, Math.PI / 2, 0), true, false);
loadModel('3Dmodels/school_whiteboard_90cm_x_120cm.glb', new THREE.Vector3(0, -3, -5), new THREE.Vector3(3, 3, 3), new THREE.Euler(0, 0, 0));

// texture for windows
const createWindowPlane = (position) => {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.7),
        new THREE.MeshBasicMaterial({ map: windowTexture, side: THREE.DoubleSide })
    );
    plane.position.set(...position);
    plane.rotation.y = -Math.PI / 2;
    scene.add(plane);
};

createWindowPlane([4.99, 0, -3]);
createWindowPlane([4.99, 0, 3]);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

