import "@Styles/error.css";
import Mountains from "@Components/mountains";
import Motion from "@Components/motion";
import Card from "@Components/card";
import Fog from "@Components/fog";

export default function Error(title: string, message: string) {

    const _title = document.createElement('div');
    _title.classList.add('title', 'error');
    _title.textContent = title;

    const error = document.createElement('div');
    error.classList.add('error');
    error.innerText = message;
    error.insertAdjacentHTML("beforeend", '<a href="/">Head back to the homepage?</a>');

    return Card({
        childs: [
            _title,
            error,
        ],
        lazyChilds: [
            Motion,
            Fog,
            Mountains,
        ]
    });
}