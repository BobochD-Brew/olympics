import { createSignal } from "./signal";

const [ width, setWidth ] = createSignal(window.innerWidth);
const [ height, setHeight ] = createSignal(window.innerWidth);
const [ ratio, setRatio ] = createSignal(window.innerWidth / window.innerHeight);

let added = false;

export function useWindow() {

    const fov = () => Math.max(1.3, 1.75 / ratio());

    if(!added) {
        added = true;
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
            setRatio(window.innerWidth / window.innerHeight)
        });
    }

    return {
        width,
        height,
        ratio,
        fov,
    }
}