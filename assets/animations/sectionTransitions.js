import { gsap } from "gsap";

let cleanup = null;

function initSectionTransitions() {
    // Nettoyer les anciens écouteurs
    if (cleanup) {
        cleanup();
        cleanup = null;
    }

    // Récupérer les éléments de la page actuelle
    const veil = document.querySelector(".section-transition");
    const home = document.querySelector("#home");
    const projects = document.querySelector("#projets");
    const profile = document.querySelector("#profile");
    const contact = document.querySelector("#contact");

    // Ne rien faire sur les pages de détail
    if (!veil || !home || !projects || !profile || !contact) return;

    const clamp = gsap.utils.clamp(0, 1);

    const sections = [home, projects, profile, contact];

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

    // Animation du voile
    const updateVeil = () => {
        const viewportHeight = window.innerHeight;

        const projectsTop = projects.getBoundingClientRect().top;
        const profileTop = profile.getBoundingClientRect().top;
        const contactTop = contact.getBoundingClientRect().top;

        let color = "#ff8a00";
        let opacity = 0;

        // HOME → PROJETS
        if (projectsTop > 0) {
            const progress = clamp(1 - projectsTop / viewportHeight);

            color = "#ff8a00";
            opacity = progress * 0.18;

            // PROJETS
        } else if (profileTop >= viewportHeight) {
            color = "#ff8a00";
            opacity = 0.18;

            // PROJETS → PROFIL
        } else if (profileTop > 0) {
            const progress = clamp(1 - profileTop / viewportHeight);

            color = "#ff8a00";
            opacity = 0.18 * (1 - progress);

            // PROFIL
        } else if (contactTop >= viewportHeight) {
            color = "#ff8a00";
            opacity = 0;

            // PROFIL → CONTACT
        } else if (contactTop > 0) {
            const progress = clamp(1 - contactTop / viewportHeight);

            color = "#d40000";
            opacity = progress * 0.16;

            // CONTACT
        } else {
            color = "#d40000";
            opacity = 0.16;
        }

        gsap.set(veil, {
            backgroundColor: color,
            opacity: opacity,
        });
    };

    const updatePage = () => {
        updateVeil();
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

    // Fonction de nettoyage
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
