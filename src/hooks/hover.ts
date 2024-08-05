
export function useHover(el: HTMLElement, onEnter: () => void, onLeave: () => void) {

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter);
    el.addEventListener("touchend", onLeave);

    return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("touchstart", onEnter);
        el.removeEventListener("touchend", onLeave);
    }
}