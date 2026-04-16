const cursorGlow = document.querySelector(".cursor-glow");
const revealTargets = document.querySelectorAll("[data-reveal]");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (cursorGlow && !reduceMotion) {
  const moveGlow = (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
  };

  window.addEventListener("pointermove", moveGlow);
  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

if (revealTargets.length) {
  if (reduceMotion) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }
}

if (tiltTargets.length && !reduceMotion) {
  tiltTargets.forEach((target) => {
    const maxTilt = 10;

    target.addEventListener("pointermove", (event) => {
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * maxTilt;
      const rotateX = (0.5 - y) * maxTilt;

      target.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}
