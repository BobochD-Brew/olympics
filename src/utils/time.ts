/* @vite-ignore */

declare global {
    interface Function {
        Delay(ms: number): (...args: any[]) => Promise<any>;
        Duration(ms: number): (...args: any[]) => Promise<any>;
    }
}
  
Function.prototype.Delay = function (ms: number) {
    const fn = this;
    return (...args: any[]) => new Promise(resolve => setTimeout(() => resolve(fn(...args)), ms));
};

Function.prototype.Duration = function (ms: number) {
    const fn = this;
    return async function (...args: any[]) {
        const startTime = Date.now();
        const result = await Promise.resolve(fn(...args));
        const elapsedTime = Date.now() - startTime;
        setTimeout(result, Math.max(0, ms - elapsedTime))
    };
};