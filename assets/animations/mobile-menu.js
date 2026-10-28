export function initMobileMenu() {
    const button = document.querySelector(".mobile-menu-toggle");
    const menu = document.querySelector("#mobile-menu");

    if (!button || !menu) return;

    function setMenuOpen(open) {
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute(
            "aria-label",
            open ? "Fermer le menu" : "Ouvrir le menu",
        );

        menu.inert = !open;
        menu.classList.toggle("is-open", open);
    }

    // Éviter les écouteurs en double
    if (button.dataset.initialized === "true") return;
    button.dataset.initialized = "true";

    button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        setMenuOpen(open);
    });

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            // Fermer le menu
            setMenuOpen(false);

            // Naviguer sans rechargement Turbo
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth",
            });
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuOpen(false);
    });
}

// Initialisation et réinitialisation après navigation Turbo
document.addEventListener("turbo:load", initMobileMenu);
