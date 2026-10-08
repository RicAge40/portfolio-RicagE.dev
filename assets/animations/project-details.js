import { gsap } from "gsap";

document.querySelectorAll(".project-link").forEach((button) => {
    const details = document.getElementById(
        button.getAttribute("aria-controls"),
    );

    const card = button.closest(".project-card");

    if (!details || !card) return;

    const closeButton = details.querySelector(".project-details__close");
    if (!closeButton) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotion ? 0 : 0.4;

    let animating = false;

    function show(element) {
        element.hidden = false;
        gsap.set(element, { clearProps: "all" });
    }

    function hide(element) {
        gsap.set(element, { clearProps: "all" });
        element.hidden = true;
    }

    // OUVERTURE
    button.addEventListener("click", () => {
        if (animating || !details.hidden) return;

        animating = true;

        gsap.to(card, {
            autoAlpha: 0,
            y: -15,
            duration,

            onComplete: () => {
                hide(card);
                show(details);

                button.setAttribute("aria-expanded", "true");
                // Repositionner la page au début du projet
                const detailsTop =
                    details.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: detailsTop - 100,
                    behavior: "smooth",
                });

                gsap.fromTo(
                    details,
                    { autoAlpha: 0, y: 15 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration,
                        onComplete: () => {
                            gsap.set(details, {
                                clearProps: "opacity,visibility,transform",
                            });

                            animating = false;
                            closeButton.focus();
                        },
                    },
                );
            },
        });
    });

    // FERMETURE
    closeButton.addEventListener("click", () => {
        if (animating || details.hidden) return;

        animating = true;

        gsap.to(details, {
            autoAlpha: 0,
            y: 15,
            duration,

            onComplete: () => {
                // Réafficher la carte avant de masquer les détails
                show(card);
                hide(details);

                button.setAttribute("aria-expanded", "false");

                // Repositionnement immédiat sur la carte HUMAIN
                const cardTop =
                    card.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: Math.max(0, cardTop - 100),
                    behavior: "instant",
                });

                gsap.fromTo(
                    card,
                    { autoAlpha: 0, y: -15 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration,
                        onComplete: () => {
                            gsap.set(card, {
                                clearProps: "opacity,visibility,transform",
                            });

                            animating = false;
                            button.focus();
                        },
                    },
                );
            },
        });
    });
});
