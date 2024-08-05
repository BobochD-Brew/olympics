import "@Styles/card.css";
import { createSignal, useEffect } from "@Hooks/signal";
import { attach, DOM } from "@Utils/dom";
import LazyCard from "./lazyCard";
import Video from "./video";

const [ backgroundColor, setBackgroundColor ] = createSignal("");

type CardProps = {
    childs: DOM[],
    lazyChilds: DOM[]
}

export default function Card({ childs, lazyChilds }: CardProps) {

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cardContainer');

    const cardTilt = document.createElement('div');
    cardTilt.classList.add('cardTilt');

    const cardContent = document.createElement('div');
    cardContent.classList.add('card');

    Video(cardContent);
    cardTilt.appendChild(cardContent);
    cardContainer.appendChild(cardTilt);

    useEffect(() => {
        const color = backgroundColor();
        cardContent.style.backgroundColor = color ? (color + "75") : "#fbf9f9";
        if(color) cardContent.classList.add('hovered');
        else cardContent.classList.remove('hovered');
    })

    attach(LazyCard({ cardContent, cardTilt, lazyChilds }),...childs)(cardContent);

    return [ cardContainer ];
}

export { backgroundColor, setBackgroundColor }