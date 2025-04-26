"use client";

import { useEffect, useRef } from "react";

interface RippleEffectProps {
    /** Tailwind class for ripple color */
    className?: string;
    /** animation length in ms */
    duration?: number;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
    className = "bg-primary/50",
    duration = 550,
}) => {
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const placeholder = placeholderRef.current;
        if (!placeholder) return;

        const container = placeholder.parentElement as HTMLElement;
        if (!container) return;

        // ensure the parent is positioned and hides overflow
        const cs = getComputedStyle(container);
        if (cs.position === "static") container.style.position = "relative";
        if (cs.overflow === "visible") container.style.overflow = "hidden";

        const handleClick = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement("span");
            ripple.className = `${className} absolute rounded-full pointer-events-none`;
            Object.assign(ripple.style, {
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: "scale(0)",
                opacity: "0.35",
                animation: `ripple-effect ${duration}ms ease-out forwards`,
            });

            container.appendChild(ripple);
            setTimeout(() => ripple.remove(), duration);
        };

        container.addEventListener("click", handleClick);
        return () => {
            container.removeEventListener("click", handleClick);
        };
    }, [className, duration]);

    // this div never shows—it's just a hook into the parent
    return <div ref={placeholderRef} style={{ display: "none" }} />;
};

export default RippleEffect;
