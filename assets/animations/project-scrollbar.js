function initProjectScrollbar() {
    const gallery = document.querySelector(".project-page__gallery");
    const scrollbar = document.querySelector(".project-page__scrollbar");
    const thumb = document.querySelector(".project-page__scrollbar-thumb");

    if (!gallery || !scrollbar || !thumb) return;

    // Éviter plusieurs initialisations sur la même galerie
    if (gallery.dataset.scrollbarInitialized === "true") return;

    gallery.dataset.scrollbarInitialized = "true";

    function updateScrollbar() {
        const visibleHeight = gallery.clientHeight;
        const totalHeight = gallery.scrollHeight;
        const maxScroll = totalHeight - visibleHeight;

        if (maxScroll <= 0) {
            scrollbar.hidden = true;
            return;
        }

        scrollbar.hidden = false;

        const trackHeight = scrollbar.clientHeight;
        const thumbHeight = (visibleHeight / totalHeight) * trackHeight;
        const maxThumbTravel = trackHeight - thumbHeight;

        const progress = Math.min(
            1,
            Math.max(0, gallery.scrollTop / maxScroll),
        );

        thumb.style.height = `${thumbHeight}px`;
        thumb.style.transform = `translateY(${progress * maxThumbTravel}px)`;
    }

    gallery.addEventListener("scroll", updateScrollbar, {
        passive: true,
    });

    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(gallery);

    gallery.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
            img.addEventListener("load", updateScrollbar, {
                once: true,
            });
        }
    });

    requestAnimationFrame(updateScrollbar);
}

// Initialisation au chargement
initProjectScrollbar();

// Chargement initial
initProjectScrollbar();

// Navigation Symfony Turbo
document.addEventListener("turbo:load", () => {
    initProjectScrollbar();
});
