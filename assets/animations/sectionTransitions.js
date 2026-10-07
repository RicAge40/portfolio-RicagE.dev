import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const veil = document.querySelector(".section-transition");
const projects = document.querySelector("#projets");
const profile = document.querySelector("#profile");
const contact = document.querySelector("#contact");

if (veil && projects && profile && contact) {
    const clamp = gsap.utils.clamp(0, 1);

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

    ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: updateVeil,
        onRefresh: updateVeil,
    });

    updateVeil();
}
