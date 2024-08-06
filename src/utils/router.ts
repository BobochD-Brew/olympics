import { attach, DOM } from "./dom";

export function createApp(root: HTMLElement, routes: Record<string, () => DOM>) {

    function handleRouteChange() {
        const path = window.location.pathname;
        const route = routes[path];
        if(!route) return navigateTo('/404');
        root.innerHTML = "";
        attach(route())(root);
    }

    async function navigateTo(url: string) {
        window.history.pushState(null, "", url);
        handleRouteChange();
    }

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();
}

type Import<T> = Promise<{default: T}>;

export async function lazy<T extends (...args: any) => DOM>(module: Import<T>, ...args: Parameters<T>) {
    return (await module).default(...args) as any;
}