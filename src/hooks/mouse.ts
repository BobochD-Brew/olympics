
export function useMouse(callback: (arg: { x: number, y: number}) => void) {

    const f = (e: MouseEvent | TouchEvent) => {
        const data = e instanceof MouseEvent ?
            { x: e.clientX, y: e.clientY } :
            { x: e.touches[0].clientX, y: e.touches[0].clientY }
        callback(data)
    }

    window.addEventListener("mousemove", f);
    window.addEventListener("touchmove", f);

    return () => {
        window.removeEventListener("mousemove", f);
        window.removeEventListener("touchmove", f);
    }
}