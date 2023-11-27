import * as THREE from "three";

// Create particle geometry and velocities
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 7000; // Number of particles
const posArray = new Float32Array(particlesCount * 3); // x, y, z for each particle
const particleVelocities = new Float32Array(particlesCount * 3); // Velocity for each particle

// Randomize particle positions and velocities
for (let i = 0; i < particlesCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 35; // X-axis
  posArray[i + 1] = (Math.random() - 0.5) * 35; // Y-axis
  posArray[i + 2] = (Math.random() - 0.5) * 300; // Z-axis, increased spread

  // Randomize velocity
  particleVelocities[i] = (Math.random() - 0.5) * 0.005;
  particleVelocities[i + 1] = (Math.random() - 0.5) * 0.005;
  particleVelocities[i + 2] = (Math.random() - 0.5) * 0.005;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

// Load particle texture
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/particle.png"); // Replace with your PNG file

// Particle system setup function
export function setupParticleSystem(scene) {
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    map: particleTexture,
    transparent: true,
    alphaTest: 0.5, // Adjust as needed to handle transparency
  });

  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);

  // Update function for particle movement
  function updateParticles() {
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] += particleVelocities[i]; // Update position based on velocity
    }

    particlesGeometry.attributes.position.needsUpdate = true; // Notify Three.js to update the positions
  }

  return updateParticles;
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add particle system to the scene
const updateParticles = setupParticleSystem(scene);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update particles
  updateParticles();

  renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
