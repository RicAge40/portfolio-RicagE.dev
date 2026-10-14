import { gsap } from "gsap";

export function initProfileBlocks() {
    const section = document.querySelector(".profile");
    const blocks = document.querySelectorAll(".profile-block");

    if (!section || !blocks.length) return;

    gsap.killTweensOf(blocks);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    blocks.forEach((block) => {
        function moveBlock() {
            const width = section.clientWidth;
            const height = section.clientHeight;

            gsap.to(block, {
                x: gsap.utils.random(-width * 0.4, width * 0.4),
                y: gsap.utils.random(-height * 0.4, height * 0.4),
                rotation: gsap.utils.random(-30, 30),
                duration: gsap.utils.random(15, 25),
                ease: "sine.inOut",
                onComplete: moveBlock,
            });
        }

        moveBlock();
    });
}
