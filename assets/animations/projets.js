import { gsap } from "gsap";

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

let galleries = [];

// Nettoyer les anciens carrousels
function cleanupProjects() {
    galleries.forEach(({ images, interval }) => {
        window.clearInterval(interval);
        gsap.killTweensOf(images);
    });

    galleries = [];
}

// Initialiser les carrousels
function initProjects() {
    cleanupProjects();

    document.querySelectorAll(".project-visual").forEach((gallery) => {
        const images = gallery.querySelectorAll(".project-card__image");

        if (images.length < 2 || reducedMotion) return;

        let current = 0;

        // Affichage initial
        gsap.set(images, { autoAlpha: 0 });
        gsap.set(images[0], { autoAlpha: 1 });

        function nextImage() {
            const next = (current + 1) % images.length;

            gsap.to(images[current], {
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.inOut",
                overwrite: true,
            });

            gsap.to(images[next], {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.inOut",
                overwrite: true,
            });

            current = next;
        }

        const item = {
            images,
            interval: null,
        };

        function start() {
            if (item.interval || document.hidden) return;

            item.interval = window.setInterval(nextImage, 3000);
        }

        galleries.push(item);
        start();
    });
}

// Pause lorsque l'onglet est masqué
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        galleries.forEach((item) => {
            window.clearInterval(item.interval);
            item.interval = null;
        });
    } else {
        galleries.forEach((item) => {
            if (!item.interval) {
                // Réinitialiser proprement les carrousels
                initProjects();
                return;
            }
        });
    }
});

// Navigation Symfony Turbo
document.addEventListener("turbo:before-cache", cleanupProjects);
document.addEventListener("turbo:load", initProjects);

// Premier chargement
initProjects();
