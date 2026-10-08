import { gsap } from "gsap";

const lightbox = document.querySelector("#project-lightbox");

if (lightbox) {
    const image = lightbox.querySelector(".project-lightbox__image");
    const closeButton = lightbox.querySelector(".project-lightbox__close");
    const zoomButtons = document.querySelectorAll(".project-details__zoom");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let previousFocus = null;
    let animation = null;

    function openLightbox(button) {
        const sourceImage = button.querySelector("img");
        if (!sourceImage) return;

        animation?.kill();

        previousFocus = button;

        image.src = sourceImage.currentSrc || sourceImage.src;
        image.alt = sourceImage.alt;

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";

        animation = gsap.fromTo(
            lightbox,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: reducedMotion.matches ? 0 : 0.3,
                ease: "power2.out",
                onComplete: () => {
                    animation = null;
                },
            },
        );

        closeButton.focus();
    }

    function closeLightbox() {
        if (lightbox.hidden) return;

        animation?.kill();

        animation = gsap.to(lightbox, {
            autoAlpha: 0,
            duration: reducedMotion.matches ? 0 : 0.25,
            ease: "power2.in",
            onComplete: () => {
                lightbox.hidden = true;

                gsap.set(lightbox, {
                    clearProps: "opacity,visibility",
                });

                document.body.style.overflow = "";

                previousFocus?.focus();
                animation = null;
            },
        });
    }

    zoomButtons.forEach((button) => {
        button.addEventListener("click", () => {
            openLightbox(button);
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    // Fermer en cliquant sur le fond
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Échap + maintien du focus dans la lightbox
    document.addEventListener("keydown", (event) => {
        if (lightbox.hidden) return;

        if (event.key === "Escape") {
            event.preventDefault();
            closeLightbox();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            closeButton.focus();
        }
    });
}
