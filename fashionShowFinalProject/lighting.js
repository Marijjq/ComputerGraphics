import * as THREE from 'three';

export function initializeLighting(scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional Light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(0, 200, 200);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  scene.add(directionalLight);

  // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xffffff);
  // scene.add(directionalLightHelper);
  
    // Adding point lights
    // const pointLight1 = new THREE.PointLight(0xffffff, 1, 200); // color, intensity, distance
    // pointLight1.position.set(-75, 60, -10);  // Position of the point light
    // pointLight1.castShadow = true;  // Enable shadow casting
    // scene.add(pointLight1);
  
    // const pointLight2 = new THREE.PointLight(0xffffff, 1, 200);
    // pointLight2.position.set(-20, 60, -10);
    // pointLight2.castShadow = true;
    // scene.add(pointLight2);
  
    // const pointLight3 = new THREE.PointLight(0xffffff, 1, 200);
    // pointLight3.position.set(17, 60, -10);
    // pointLight3.castShadow = true;
    // scene.add(pointLight3);
  
    // const pointLight4 = new THREE.PointLight(0xffffff, 1, 200);
    // pointLight4.position.set(70, 60, -10);
    // pointLight4.castShadow = true;
    // scene.add(pointLight4);
  
    // // Optional: Add helpers to visualize light positions
    // const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 5); // size of the helper
    // scene.add(pointLightHelper1);
  
    // const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 5);
    // scene.add(pointLightHelper2);
  
    // const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 5);
    // scene.add(pointLightHelper3);
    
    // const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, 5);
    // scene.add(pointLightHelper4);

  // Spotlight
  const spotlight = new THREE.SpotLight(0xffee88, 3, 0, Math.PI / 4, 0, 0);
  spotlight.castShadow = true;
  spotlight.position.set(0, 100, 100);
  scene.add(spotlight);

  // Spotlight helper (for debugging)
  // const spotlightHelper = new THREE.SpotLightHelper(spotlight);
  // scene.add(spotlightHelper);

  // Return spotlight so it can be used in other files
  return spotlight;
}
