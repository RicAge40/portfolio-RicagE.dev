let cleanup = null;

function initSectionTransitions() {
    // Nettoyer les anciens écouteurs
    if (cleanup) {
        cleanup();
        cleanup = null;
    }

    const home = document.querySelector("#home");
    const projects = document.querySelector("#projets");
    const profile = document.querySelector("#profile");
    const contact = document.querySelector("#contact");

    // Ne rien faire sur les pages de détail
    if (!home || !projects || !profile || !contact) return;

    const sections = [home, projects, profile, contact];
    const heroNav = document.querySelector(".hero-nav");

    let currentHash = window.location.hash;

    // Synchronisation de l'URL
    const updateURL = () => {
        const reference = window.innerHeight * 0.5;

        let activeSection = sections[0];

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= reference) {
                activeSection = section;
            }
        });
        heroNav?.classList.toggle("is-docked", activeSection !== home);

        heroNav?.querySelectorAll("a").forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${activeSection.id}`;

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
        const newHash =
            activeSection.id === "home" ? "" : `#${activeSection.id}`;

        if (newHash === currentHash) return;

        currentHash = newHash;

        history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search + newHash,
        );
    };

    // Mise à jour au scroll
    const updatePage = () => {
        updateURL();
    };

    window.addEventListener("scroll", updatePage, { passive: true });
    window.addEventListener("resize", updatePage);
    window.addEventListener("hashchange", updatePage);

    // Navigation fluide
    const navLinks = document.querySelectorAll('.hero-nav a[href^="#"]');

    const linkHandlers = [];

    navLinks.forEach((link) => {
        const handler = (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth",
            });
        };

        link.addEventListener("click", handler);

        linkHandlers.push({ link, handler });
    });

    // Mise à jour après restauration du scroll par Turbo
    requestAnimationFrame(updatePage);

    // Nettoyage des écouteurs
    cleanup = () => {
        window.removeEventListener("scroll", updatePage);
        window.removeEventListener("resize", updatePage);
        window.removeEventListener("hashchange", updatePage);

        linkHandlers.forEach(({ link, handler }) => {
            link.removeEventListener("click", handler);
        });
    };
}

// Chargement initial
initSectionTransitions();

// Navigation Symfony Turbo
document.addEventListener("turbo:load", initSectionTransitions);

// Nettoyage avant mise en cache
document.addEventListener("turbo:before-cache", () => {
    if (cleanup) {
        cleanup();
        cleanup = null;
    }
});
