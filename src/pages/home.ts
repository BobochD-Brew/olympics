import Card from "@Components/card";
import Rings from "@Components/rings";
import Motion from "@Components/motion";
import Fog from "@Components/fog";
import Mountains from "@Components/mountains";

export default function Home() {

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = 'Olympic medals per continent* in Paris 2024';

    const gap = document.createElement('div');
    gap.classList.add('gap');

    const details = document.createElement('div');
    details.classList.add('details');
    details.innerHTML = "* The composition of nations by continent and their subregions is based on UN's 'macro geographical (continental) regions', which can be found in: <a href=\"https://unstats.un.org/unsd/methodology/m49/\" target=\"_blank\">https://unstats.un.org/unsd/methodology/m49/</a>";

    const source = document.createElement('div');
    source.classList.add('source');
    source.innerHTML = 'Source: <a href=\"https://www.olympiandatabase.com/\" target=\"_blank\">https://www.olympiandatabase.com/</a>';

    return Card({
        childs: [
            title,
            gap,
            details,
            source,
            Rings,
            Motion,
            Fog,
            Mountains,
        ],
        lazyChilds: [
            // () => lazy(import("@Components/rings")),
            // () => lazy(import("@Components/motion")),
            // () => lazy(import("@Components/fog")),
            // () => lazy(import("@Components/mountains")),
        ]
    });
}