import Error from "@Components/error";

export default function NotFound() {

    document.body.style.backgroundImage = 'url(/backgroundHD.jpg)';
    
    return Error("404", "Page not found!");
}