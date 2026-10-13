function initProjectPanels() {
    document.querySelectorAll(".project-card").forEach((card) => {
        const trigger = card.querySelector(".project-card__trigger");
        const details = card.querySelector(".project-card__details");

        if (!trigger || !details) return;

        // Éviter une double initialisation
        if (card.dataset.panelInitialized === "true") return;
        card.dataset.panelInitialized = "true";

        function openPanel() {
            // Fermer les autres projets
            document
                .querySelectorAll(".project-card.is-open")
                .forEach((other) => {
                    if (other !== card) {
                        other.classList.remove("is-open");

                        const otherDetails = other.querySelector(
                            ".project-card__details",
                        );
                        const otherTrigger = other.querySelector(
                            ".project-card__trigger",
                        );

                        if (otherDetails) otherDetails.hidden = true;
                        if (otherTrigger)
                            otherTrigger.setAttribute("aria-expanded", "false");
                    }
                });

            details.hidden = false;
            card.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
        }

        function closePanel() {
            details.hidden = true;
            card.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        }

        // Survol sur ordinateur
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            card.addEventListener("mouseenter", openPanel);
            card.addEventListener("mouseleave", closePanel);
        }

        // Clic et clavier
        trigger.addEventListener("click", () => {
            if (card.classList.contains("is-open")) {
                closePanel();
            } else {
                openPanel();
            }
        });

        // Échap pour fermer
        card.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closePanel();
                trigger.focus();
            }
        });
    });
}

// Chargement initial
initProjectPanels();

// Navigation Symfony Turbo
document.addEventListener("turbo:load", initProjectPanels);
