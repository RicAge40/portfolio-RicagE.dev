import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let profileContext = null;

function initProfileReveal() {
    if (profileContext) {
        profileContext.revert();
        profileContext = null;
    }

    const profile = document.querySelector(".profile");
    if (!profile) return;

    profileContext = gsap.context(() => {
        const elements = [
            ".profile-photo",
            ".profile-intro h3",
            ".profile-intro p",
        ];

        gsap.utils.toArray(elements.join(", ")).forEach((element) => {
            gsap.from(element, {
                opacity: 0,
                y: 25,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    once: true,
                },
            });
        });
    }, profile);
}

document.addEventListener("turbo:load", initProfileReveal);

document.addEventListener("turbo:before-cache", () => {
    if (profileContext) {
        profileContext.revert();
        profileContext = null;
    }
});
