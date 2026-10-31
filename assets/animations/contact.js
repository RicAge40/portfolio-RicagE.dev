// Afficher le formulaire ou revenir au texte
document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const openButton = event.target.closest(".contact-scatter[aria-controls]");
    const backButton = event.target.closest(".contact-form-back");

    if (!openButton && !backButton) return;

    const section = event.target.closest(".contact");
    if (!section) return;

    const trigger = section.querySelector(".contact-scatter");
    const panel = section.querySelector(".contact-form-panel");

    if (!trigger || !panel) return;

    const opening = Boolean(openButton);

    trigger.setAttribute("aria-expanded", String(opening));
    trigger.hidden = opening;
    panel.hidden = !opening;

    if (opening) {
        panel.querySelector("input")?.focus({ preventScroll: true });
    } else {
        trigger.focus({ preventScroll: true });
    }

    // Revenir au début de CONTACT après le changement de hauteur
    section.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        block: "start",
    });
});
