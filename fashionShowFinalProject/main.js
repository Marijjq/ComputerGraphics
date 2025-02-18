// Import necessary modules
import * as THREE from 'three';
import { loadStage } from './stage.js';
import { loadTextures } from './textures.js';
import { initializeLighting } from './lighting.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0); 

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
renderer.setPixelRatio(window.devicePixelRatio); // Adjust pixel ratio for high-DPI screens
document.body.appendChild(renderer.domElement); 

// Load textures
const textures = loadTextures(); 

// Create Room Function
function createRoom(textures) {
    const roomSize = 400; // Set size of the room
    const geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize); 
    const materialArray = [
        new THREE.MeshStandardMaterial({ map: textures.wallRoomTexture, side: THREE.BackSide }), // Wall material
        new THREE.MeshStandardMaterial({ map: textures.wallRoomTexture, side: THREE.BackSide }), // Wall material
        new THREE.MeshStandardMaterial({ map: textures.ceilingRoomTexture, side: THREE.BackSide }), // Ceiling material
        new THREE.MeshStandardMaterial({ map: textures.floorRoomTexture, side: THREE.BackSide }), // Floor material
        new THREE.MeshStandardMaterial({ map: textures.wallRoomTexture, side: THREE.BackSide }), // Wall material
        new THREE.MeshStandardMaterial({ map: textures.wallRoomTexture, side: THREE.BackSide }) // Wall material
    ];
    const room = new THREE.Mesh(geometry, materialArray); 
    room.position.set(0, roomSize / 2 - 10, 0); 
    room.receiveShadow = true; 
    scene.add(room); 
}

// Create Smoke Effect Function
function createSmoke(scene, xPosition, zPosition) {
    const particleCount = 1000; // Set number of smoke particles
    const geometry = new THREE.BufferGeometry(); // Create geometry for the particles
    const positions = []; // Array to hold particle positions
    const textureLoader = new THREE.TextureLoader(); // Texture loader to load smoke texture
    const smokeTexture = textureLoader.load('textures/smoke.png'); // Load smoke texture (ensure path is correct)

    // Material for the smoke particles
    const material = new THREE.PointsMaterial({
        size: 10, // Size of each particle
        map: smokeTexture, // Set the texture to smoke
        blending: THREE.AdditiveBlending, // Additive blending to make smoke look realistic
        depthWrite: false, // Disable depth writing for transparent particles
        transparent: true, // Make particles transparent
        opacity: 0.2, // Set opacity of smoke particles
    });

    // Generate random particle positions for the smoke effect
    for (let i = 0; i < particleCount; i++) {
        positions.push(
            Math.random() * 100 + xPosition, // Random X position (centered around xPosition)
            Math.random() * 10 - 5,          // Random Y position (close to ground)
            Math.random() * 100 + zPosition  // Random Z position (centered around zPosition)
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); // Set positions as a geometry attribute
    const points = new THREE.Points(geometry, material); // Create points (smoke particles) with the geometry and material
    scene.add(points); // Add smoke effect to the scene

    // Animation for the smoke effect (particles moving upwards)
    function animateSmoke() {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.random() * 0.1; // Move particles upward (Y-axis)
            if (positions[i + 1] > 10) positions[i + 1] = Math.random() * 5 - 5; // Reset position near ground if too high
        }
        geometry.attributes.position.needsUpdate = true; // Update positions of particles
        requestAnimationFrame(animateSmoke); // Call animateSmoke recursively for animation
    }

    animateSmoke(); // Start animating the smoke
}

// Initialize the Scene
function init() {

    createRoom(textures); // Create the room with textures
    createSmoke(scene, 30, 20);  // Add smoke effect at a positive x position
    createSmoke(scene, -130, 20); // Add smoke effect at a negative x position

    // Load Stage, Lighting, and Controls
    loadStage(scene, textures, renderer, camera); // Load stage (not detailed in code, assumed external)
    initializeLighting(scene); // Initialize lighting in the scene
    initializeControls(camera, renderer); // Initialize OrbitControls for camera navigation

    // Animation Loop
    animate(); 
}

// Initialize OrbitControls for camera movement
function initializeControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement); // Set up OrbitControls
    controls.enableDamping = true; // Enable smooth camera movement
    controls.dampingFactor = 0.25; // Set the damping factor for smoothness
    controls.screenSpacePanning = false; // Disable screen space panning (no sideways camera drag)
}

// Animation Loop for the scene rendering
function animate() {
    requestAnimationFrame(animate); 
    renderer.render(scene, camera); 
}

// Start the Application
init(); 
