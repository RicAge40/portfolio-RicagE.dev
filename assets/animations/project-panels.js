import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

function initProjectPanels() {
    document.querySelectorAll(".project-card").forEach((card) => {
        const trigger = card.querySelector(".project-card__trigger");
        const details = card.querySelector(".project-card__details");
        const detailsInner = details?.querySelector(
            ".project-card__details-inner",
        );

        if (!trigger || !details || !detailsInner) return;

        if (card.dataset.panelInitialized === "true") return;
        card.dataset.panelInitialized = "true";

        let animating = false;

        function openPanel() {
            if (animating || card.classList.contains("is-open")) return;

            animating = true;

            // Fermer immédiatement les autres projets
            document
                .querySelectorAll(".project-card.is-open")
                .forEach((other) => {
                    if (other === card) return;

                    other.classList.remove("is-open");

                    const otherDetails = other.querySelector(
                        ".project-card__details",
                    );
                    const otherTrigger = other.querySelector(
                        ".project-card__trigger",
                    );

                    if (otherDetails) otherDetails.hidden = true;
                    if (otherTrigger) {
                        otherTrigger.setAttribute("aria-expanded", "false");
                    }
                });

            // État initial des cartes
            const cards = document.querySelectorAll(".project-card");
            const state = Flip.getState(cards);
            // Le panneau occupe sa place, mais son contenu reste invisible
            details.hidden = false;
            gsap.set(detailsInner, { opacity: 0 });

            card.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");

            // Étape 1 : agrandissement
            Flip.from(state, {
                duration: 0.9,
                ease: "power2.inOut",
                absolute: false,

                onComplete: () => {
                    // Étape 2 : apparition des informations
                    gsap.fromTo(
                        detailsInner,
                        { opacity: 0, y: 8 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            onComplete: () => {
                                animating = false;
                            },
                        },
                    );
                },
            });
        }

        function closePanel() {
            if (animating || !card.classList.contains("is-open")) return;

            animating = true;

            // Masquer progressivement les informations
            gsap.to(detailsInner, {
                opacity: 0,
                duration: 0.25,
                ease: "power2.in",

                onComplete: () => {
                    const cards = document.querySelectorAll(".project-card");
                    const state = Flip.getState(cards);

                    details.hidden = true;
                    card.classList.remove("is-open");
                    trigger.setAttribute("aria-expanded", "false");

                    // Réduction de la carte
                    Flip.from(state, {
                        duration: 0.9,
                        ease: "power2.inOut",
                        absolute: false,

                        onComplete: () => {
                            gsap.set(detailsInner, { clearProps: "opacity" });
                            animating = false;
                        },
                    });
                },
            });
        }

        // Clic
        trigger.addEventListener("click", () => {
            if (card.classList.contains("is-open")) {
                closePanel();
            } else {
                openPanel();
            }
        });

        // Échap
        card.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && card.classList.contains("is-open")) {
                closePanel();
                trigger.focus();
            }
        });
    });
}

initProjectPanels();

document.addEventListener("turbo:load", initProjectPanels);
