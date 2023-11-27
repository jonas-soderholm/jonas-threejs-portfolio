import gsap from "gsap";
import * as THREE from "three";

let loadingFinished = false;
export { loadingFinished };

// Function to reveal the site after the loading bar completes
export function revealSite() {
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
      loadingFinished = true;
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
