import { gsap } from "gsap";

const logo = document.querySelector(".hero-logo svg");

if (logo) {
    gsap.set(".hero", {
        visibility: "visible",
    });
    const timeline = gsap.timeline();

    // RicagE : grossit rapidement puis se pose doucement
    timeline.from(logo, {
        scale: 0.05,
        opacity: 0,
        duration: 1.8,
        ease: "power3.out",
        transformOrigin: "50% 50%",
    });

    // Pavé gauche
    timeline.from(
        "#block-left",
        {
            y: -window.innerHeight,
            duration: 2,
            ease: "power1.in",
        },
        0.45,
    );

    // Pavé central
    timeline.from(
        "#block-center",
        {
            y: window.innerHeight,
            duration: 2,
            ease: "power1.in",
        },
        0.65,
    );

    // Pavé droit
    timeline.from(
        "#block-right",
        {
            y: window.innerHeight,
            duration: 2,
            ease: "power1.in",
        },
        0.85,
    );

    // .dev
    timeline.from(
        ".dev",
        {
            opacity: 0,
            x: -25,
            duration: 1.3,
            ease: "power2.out",
        },
        2.7,
    );

    // Machine à écrire
    const title = document.querySelector(".hero-content h1");
    const text = document.querySelector(".hero-content p");

    function prepareTypewriter(element) {
        const content = element.textContent.replace(/\s+/g, " ").trim();

        element.innerHTML = [...content]
            .map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`)
            .join("");

        gsap.set(element.querySelectorAll("span"), {
            opacity: 0,
        });
    }

    prepareTypewriter(title);
    prepareTypewriter(text);

    // Du métier au digital.
    timeline.to(
        title.querySelectorAll("span"),
        {
            opacity: 1,
            duration: 0.01,
            stagger: 0.055,
        },
        3.5,
    );

    // Je conçois...
    timeline.to(
        text.querySelectorAll("span"),
        {
            opacity: 1,
            duration: 0.01,
            stagger: 0.025,
        },
        ">",
    );

    // Pavés de fond : apparition douce avant la machine à écrire
    timeline.to(
        ".hero-bg__block",
        {
            opacity: 0.18,
            duration: 1.4,
            ease: "sine.inOut",
            stagger: 0.15,
            onComplete: startBackgroundAnimation,
        },
        2.6,
    );

    function startBackgroundAnimation() {
        const bgBlocks = document.querySelectorAll(".hero-bg__block");

        const movements = [
            { x: 1050, y: 300, rotation: 10, duration: 18 },
            { x: 650, y: -750, rotation: -8, duration: 22 },
            { x: -1100, y: 420, rotation: 8, duration: 25 },
        ];

        bgBlocks.forEach((block, index) => {
            const move = movements[index];

            gsap.to(block, {
                x: move.x,
                y: move.y,
                rotation: move.rotation,
                duration: move.duration,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        });
    }
}
