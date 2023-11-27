import gsap from "gsap";
import * as THREE from "three";

let isAnimating = false;

export function fadeTrigger(camera, plane) {
  const distance = camera.position.distanceTo(plane.position);

  if (distance > 3) {
    if (distance < 11 && !isAnimating) {
      // If closer than 9 units and not currently animating, start fade-in
      isAnimating = true;
      gsap.to(plane.material, {
        opacity: 1,
        duration: 0.6,
        onStart: () => {
          plane.material.transparent = true;
        },
        onComplete: () => {
          isAnimating = false;
        },
      });
    } else if (
      (distance >= 11 && !isAnimating) ||
      (distance >= 2 && !isAnimating)
    ) {
      // If further than 9 units and not currently animating, start fade-out
      isAnimating = true;
      gsap.to(plane.material, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          isAnimating = false;
        },
      });
    }
  } else {
    // If further than 9 units and not currently animating, start fade-out
    isAnimating = true;
    gsap.to(plane.material, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        isAnimating = false;
      },
    });
  }
}
