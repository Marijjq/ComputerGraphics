import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, Clock } from 'three';
import { initializeLighting } from './lighting';

// Utility function: Enable shadows on mesh nodes
function applyShadows(node) {
  if (node.isMesh) {
    node.castShadow = true;
    node.receiveShadow = true;
  }
}

// Utility function: Load a 3D model and add shadows
function loadModel(loader, path, position, scale, rotation, scene, key, isVisible = false) {
  return new Promise((resolve, reject) => {
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.position.set(...position);
      model.scale.set(...scale);
      model.rotation.y -= Math.PI / 2;
      model.visible = isVisible;

      model.traverse(applyShadows);
      scene.add(model);

      resolve({ model, animationClips: gltf.animations });
    }, undefined, reject);
  });
}

// Function to load and add audience models
function loadAudienceModel(loader, path, position, rotation, texture, scene) {
  loader.load(path, (gltf) => {
    const audience = gltf.scene;
    audience.scale.set(7, 7, 7);
    audience.position.set(...position);
    audience.rotation.y = rotation;

    audience.traverse((node) => {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.2,
        });
        applyShadows(node);
      }
    });

    scene.add(audience);
  });
}

// Function to initialize models with animations
async function loadModelsWithAnimations(loader, modelDataArray, scene) {
  const models = {};
  const mixers = [];

  for (const { path, position, scale, rotation, key } of modelDataArray) {
    const { model, animationClips } = await loadModel(loader, path, position, scale, rotation, scene, key);
    const mixer = new AnimationMixer(model);
    models[key] = { model, mixer, animationClips };
    mixers.push(mixer);
  }

  return { models, mixers };
}

// Function to play animation for a model
function playModelAnimation(modelKey, models, mixers, animationQueue) {
  const { model, mixer, animationClips } = models[modelKey];

  model.visible = true;

  animationClips.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.reset();
    action.play();
    action.loop = THREE.LoopOnce;
    action.clampWhenFinished = true;
  });

  mixer.addEventListener('finished', () => {
    model.visible = false;
    // Start the next animation if there are more in the sequence
    if (animationQueue.length > 0) {
      const nextModelData = animationQueue.shift();
      playModelAnimation(nextModelData.key, models, mixers, animationQueue);
    }
  });
}

// Handle keydown event to trigger animations
function handleKeydownEvent(event, originalAnimationQueue, models, mixers) {
  const keyMap = {
    '1': [originalAnimationQueue[0], originalAnimationQueue[1], originalAnimationQueue[2], originalAnimationQueue[3]],
    '2': [originalAnimationQueue[1], originalAnimationQueue[0], originalAnimationQueue[2], originalAnimationQueue[3]],
    '3': [originalAnimationQueue[2], originalAnimationQueue[0], originalAnimationQueue[1], originalAnimationQueue[3]],
    '4': [originalAnimationQueue[3], originalAnimationQueue[0], originalAnimationQueue[1], originalAnimationQueue[2]],
  };

  if (keyMap[event.key]) {
    const animationQueue = [...keyMap[event.key]];
    mixers.forEach(mixer => mixer.stopAllAction());
    
    // Start the first animation immediately
    const firstModelData = animationQueue.shift();
    playModelAnimation(firstModelData.key, models, mixers, animationQueue);
  }
}

// Main function to load the stage
export function loadStage(scene, textures, renderer, camera) {
  const loader = new GLTFLoader();
  const clock = new Clock();
  const animationQueue = [
    { path: '3Dmodels/model1.glb', position: [50, 10, -50], scale: [30, 30, 30], rotation: 0, key: 'model1' },
    { path: '3Dmodels/model2.glb', position: [50, 10, -50], scale: [30, 30, 30], rotation: 0, key: 'model2' },
    { path: '3Dmodels/model3.glb', position: [50, 10, -50], scale: [15, 15, 15], rotation: 0, key: 'model3' },
    { path: '3Dmodels/model4.glb', position: [50, 10, -50], scale: [30, 30, 30], rotation: 0, key: 'model4' },
  ];

  // Load the stage and apply shadows
  loader.load('3Dmodels/stage.glb', (gltf) => {
    const stage = gltf.scene;
    stage.scale.set(25, 25, 25);
    stage.position.set(0, -10, 0);
    stage.rotation.y -= Math.PI / 2;
    scene.add(stage);
    stage.traverse(applyShadows);
  });

  // Load audience models with textures
  loadAudienceModel(loader, '3Dmodels/audience.glb', [-55, -9, 110], Math.PI / 2, textures.audienceTexture, scene);
  loadAudienceModel(loader, '3Dmodels/audience.glb', [55, -9, 30], -Math.PI / 2, textures.audienceTexture, scene);

  // Initialize lighting and get the spotlight
  const spotlight = initializeLighting(scene);

  // Load all models and prepare animations
  loadModelsWithAnimations(loader, animationQueue, scene).then(({ models, mixers }) => {
    // Add keydown event listener for animation sequences
    window.addEventListener('keydown', (event) => handleKeydownEvent(event, animationQueue, models, mixers));

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      mixers.forEach(mixer => mixer.update(delta));

      // Update spotlight position to follow the active model
      const activeModel = Object.values(models).find(m => m.model.visible);
      if (activeModel) {
        const modelPosition = new THREE.Vector3();
        activeModel.model.getWorldPosition(modelPosition);
        spotlight.position.set(modelPosition.x, modelPosition.y + 50, modelPosition.z + 50);
        spotlight.target = activeModel.model;
      }

      renderer.render(scene, camera);
    }

    animate();
  });
}
