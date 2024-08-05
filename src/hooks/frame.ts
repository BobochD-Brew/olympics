
export const updateFunctions: Array<Function> = [];

export function useFrame(update: (delta: number) => void) {

    updateFunctions.push(update);

    return () => updateFunctions.splice(updateFunctions.indexOf(update), 1);
}