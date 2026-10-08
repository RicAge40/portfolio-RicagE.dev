import { gsap } from "gsap";

const veil = document.querySelector(".section-transition");
const projects = document.querySelector("#projets");
const profile = document.querySelector("#profile");
const contact = document.querySelector("#contact");

if (veil && projects && profile && contact) {
    const clamp = gsap.utils.clamp(0, 1);

    // Synchronisation de l'URL avec la section affichée
    const sections = [
        document.querySelector("#home"),
        projects,
        profile,
        contact,
    ];

    let currentHash = window.location.hash;

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

    const updateVeil = () => {
        const viewportHeight = window.innerHeight;

        const projectsTop = projects.getBoundingClientRect().top;
        const profileTop = profile.getBoundingClientRect().top;
        const contactTop = contact.getBoundingClientRect().top;

        let color = "#ff8a00";
        let opacity = 0;

        /*
         * HOME → PROJETS
         * 0 → 0.18 orange
         */
        if (projectsTop > 0) {
            const progress = clamp(1 - projectsTop / viewportHeight);

            color = "#ff8a00";
            opacity = progress * 0.18;
        } else if (profileTop >= viewportHeight) {
            /*
             * PROJETS
             * Orange stable
             */
            color = "#ff8a00";
            opacity = 0.18;
        } else if (profileTop > 0) {
            /*
             * PROJETS → PROFIL
             * 0.18 → 0
             */
            const progress = clamp(1 - profileTop / viewportHeight);

            color = "#ff8a00";
            opacity = 0.18 * (1 - progress);
        } else if (contactTop >= viewportHeight) {
            /*
             * PROFIL
             * Noir
             */
            color = "#ff8a00";
            opacity = 0;
        } else if (contactTop > 0) {
            /*
             * PROFIL → CONTACT
             * 0 → 0.16 rouge
             */
            const progress = clamp(1 - contactTop / viewportHeight);

            color = "#d40000";
            opacity = progress * 0.16;
        } else {
            /*
             * CONTACT
             * Rouge stable
             */
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

    updatePage();

    // Navigation fluide vers les sections
    document.querySelectorAll('.hero-nav a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth",
            });
        });
    });
}
