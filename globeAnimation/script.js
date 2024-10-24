import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a wireframe globe
const globeGeometry = new THREE.SphereGeometry(1, 16, 16); // Fewer segments
const globeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, 
    wireframe: true
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);


// Add lighting (optional, as wireframes do not react to light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop to rotate the globe
function animate() {
    requestAnimationFrame(animate);

    // Rotate the globe
    globe.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
