import gsap from "gsap";
import * as THREE from "three";

// Function to reveal the site after the loading bar completes
function revealSite() {
  const loadingScreen = document.getElementById("loading-screen");
  const mainContent = document.getElementById("main-content");
  const loadingTitle = document.querySelector(".loading-title");
  const loadingNumber = document.getElementById("loading-number");
  const timeline = gsap.timeline();

  // Fade out the "Entering portfolio" text and the loading percentage
  timeline.to([loadingTitle, loadingNumber], {
    opacity: 0,
    duration: 0.5,
    stagger: 0.0,
    onComplete: () => {
      // Hide the loading screen and reveal the main content
      timeline.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          loadingScreen.style.display = "none";
          mainContent.style.opacity = "1";

          // Fade out the background
          timeline.to(document.body, {
            backgroundColor: "transparent",
            duration: 1,
          });
        },
      });
    },
  });
}

// Function to fill the loading bar
function fillLoadingBar() {
  const loadingProgress = document.getElementById("loading-number");

  // Update the loading progress text as the loading bar fills up
  let progress = 0;
  const updateProgress = () => {
    progress += 2;
    loadingProgress.textContent = progress + "%";
    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      // When the progress reaches 100%, reveal the site
      revealSite();
    }
  };
  requestAnimationFrame(updateProgress);
}

fillLoadingBar();

function handleScroll(deltaY, camera, light, scene, hueObject, fogColor) {
  const scrollDirection = deltaY > 0 ? -0.7 : 0.7;

  const newCameraZ = camera.position.z + 5 * scrollDirection;
  gsap.to(camera.position, {
    z: newCameraZ,
    duration: 1,
    ease: "power2.out",
  });

  hueObject.value = (hueObject.value + scrollDirection / 360) % 1;
  const saturation = 85;
  const lightness = 50;
  const color = new THREE.Color(
    `hsl(${hueObject.value * 360}, ${saturation}%, ${lightness}%)`
  );

  gsap.to(light.color, {
    r: color.r,
    g: color.g,
    b: color.b,
    duration: 1,
    ease: "power2.out",
  });

  scene.fog.color.set(color);
  fogColor.set(color);
}

export function setupScrollBehavior(camera, light, scene, fogColor, renderer) {
  let hue = { value: 250 / 360 };
  let lastTouchY = 0;

  // Mouse Damping Variables
  let mouseX = 0;
  let mouseY = 0;
  let mouseXPrev = 0;
  let mouseYPrev = 0;
  const dampingFactor = 0.05;

  // Mouse Move Event
  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 20 - 1;
    mouseY = (event.clientY / window.innerHeight) * 20 - 1;
  });

  // Wheel Event for Desktop
  window.addEventListener("wheel", function (e) {
    handleScroll(e.deltaY, camera, light, scene, hue, fogColor);
  });

  // Touch Events for Mobile
  window.addEventListener(
    "touchstart",
    function (e) {
      lastTouchY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      const currentTouchY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;

      handleScroll(deltaY, camera, light, scene, hue, fogColor);
    },
    { passive: true }
  );

  // Initial call to set the scene as if scrolled once
  handleScroll(0, camera, light, scene, hue, fogColor);

  // Update camera position based on mouse damping
  function updateCameraPosition() {
    const deltaY = (mouseX - mouseXPrev) * dampingFactor;
    const deltaX = (mouseY - mouseYPrev) * dampingFactor;

    camera.position.x += deltaY;
    camera.position.y -= deltaX;

    mouseXPrev = mouseX;
    mouseYPrev = mouseY;
  }

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    renderer.render(scene, camera);
  }

  animate();
}
