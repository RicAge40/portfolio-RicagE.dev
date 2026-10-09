import { gsap } from "gsap";

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

document.querySelectorAll(".project-visual").forEach((gallery) => {
    const images = gallery.querySelectorAll(".project-card__image");

    if (images.length < 2 || reducedMotion) return;

    let current = 0;
    let interval;

    // Affichage initial
    gsap.set(images, { autoAlpha: 0 });
    gsap.set(images[0], { autoAlpha: 1 });

    function nextImage() {
        const next = (current + 1) % images.length;

        gsap.to(images[current], {
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.inOut",
        });

        gsap.to(images[next], {
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.inOut",
        });

        current = next;
    }

    function start() {
        if (interval || document.hidden) return;

        interval = window.setInterval(nextImage, 3000);
    }

    function stop() {
        window.clearInterval(interval);
        interval = null;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    });

    // Retour sur la page depuis le cache du navigateur
    window.addEventListener("pageshow", () => {
        stop();

        // Arrêter les éventuelles animations en cours
        gsap.killTweensOf(images);

        // Réinitialiser le carrousel
        current = 0;

        gsap.set(images, { autoAlpha: 0 });
        gsap.set(images[0], { autoAlpha: 1 });

        start();
    });

    // Démarrage initial
    start();
});
