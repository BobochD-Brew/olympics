import '@Styles/global.css';
import { createApp, lazy } from '@Utils/router';
import Home from '@Pages/home';

document.querySelector<HTMLButtonElement>('#SEO-BODY')!.remove();
const root = document.querySelector<HTMLButtonElement>('#app')!;

createApp(root, {
    "/": () => Home(),
    "/hex": () => Home(),
    "/404": () => lazy(import("@Pages/404")),
})
