import * as THREE from "three";
import gsap from "gsap";
import "./style.css";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { setupGUI } from "./setupGUI.js";
import { setupScrollBehavior } from "./scrollBehavior.js";
import { setupParticleSystem } from "./particles";
import { revealSite, loadingFinished } from "./loadingAnimation";
import { fadeTrigger } from "./imageInteractor";

// Scene
const scene = new THREE.Scene();

// Set up fog
const fogColor = new THREE.Color(0xffffff);
const fogDensity = 1;
scene.fog = new THREE.Fog(0xffffff, 2, 20);
scene.fog.density = fogDensity;

// Background
const customMaterial = new THREE.LineBasicMaterial();
const backgroundGeometry = new THREE.PlaneGeometry(1000, 1000);
const backgroundMesh = new THREE.Mesh(backgroundGeometry, customMaterial);
backgroundMesh.position.z = -150;
scene.add(backgroundMesh);

// Load the GLB model
let myModel = null;
const loader = new GLTFLoader();

loader.load(
  "./scroll4.glb",
  (gltf) => {
    myModel = gltf.scene;
    scene.add(myModel);

    myModel.position.set(0, 0, 0);
    myModel.scale.set(1, 1, 1);
    myModel.rotation.set(-1.57, -1.57, -1.57);

    // Once the model is loaded, initialize the colors and camera position
    //initializeSceneColorsAndCamera(camera, directionalLight, scene, fogColor);

    // myModel.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     // Check if the child is a mesh
    //     child.material.wireframe = true; // Enable wireframe mode
    //   }
    // });
  },
  undefined,
  (error) => {
    console.error("An error happened", error);
  }
);

// Objects
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0,
});

// Interactive planes
const planeWidth = 10;
const planeHeight = 10;
const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

// Plane mesh
const plane = new THREE.Mesh(geometry, material);
plane.position.set(-3, 1.8, 26.2);
//plane.scale.set(-3.3, 1.7, 26.2);
plane.scale.set(0.5, 0.3, 0.1);
plane.opacity = 0;
scene.add(plane);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 50;
camera.position.y = 1.8;
camera.position.x = -3;
scene.add(camera);

// Light
const directionalLight = new THREE.DirectionalLight(0xf24a4a, 1);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Time
let time = Date.now();

// Load the noise texture
const textureLoader = new THREE.TextureLoader();
const noiseTexture = textureLoader.load("./noise-overlay.jpg");

// Create a material for the noise overlay
const noiseMaterial = new THREE.MeshBasicMaterial({
  map: noiseTexture,
  transparent: true,
  opacity: 0.02,
});

// Create a full-screen plane for the noise overlay
const noisePlaneGeometry = new THREE.PlaneGeometry(5, 2);
const noisePlane = new THREE.Mesh(noisePlaneGeometry, noiseMaterial);
noisePlane.position.z = camera.position.z + 1;
noisePlane.scale.set(0.8, 0.8, 0.8);

// Add the noise plane to the scene
scene.add(noisePlane);

// Resizer
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

export { camera, plane, sizes };

// Animation
const tick = () => {
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // mesh.rotation.y += 0.001 * deltaTime;
  noisePlane.position.copy(camera.position);
  noisePlane.position.z -= 0.6;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  fadeTrigger(camera, plane);
};

tick();

// Call setupGUI and pass renderer as a parameter
setupGUI(camera, material, myModel, plane);

// Call setupScrollBehavior and pass renderer as a parameter
setupScrollBehavior(camera, directionalLight, scene, scene.fog.color, renderer);
setupParticleSystem(scene);
