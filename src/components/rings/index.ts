import { useMedals } from "@Hooks/medals";
import { Vector3 } from "three";
import Ring from "./ring";

export default async function Rings() {

    const data = await useMedals();

    const xSpacing = 1.6;
    const ySpacing = 0.7;
    const baseHeight = 0.15;

    const maxWidth = Object.values(data).reduce((acc: number, it: any) => it.total > acc ? it.total : acc, 0);
    const width = (continent: string) => Math.sqrt(data[continent].total / maxWidth) * 0.2;

    return [
        Ring({
            label: "Africa",
            data: data["Africa"],
            video: "/videos/africa.mp4",
            shape: "/shapes/africa.svg",
            position: new Vector3(0,baseHeight + ySpacing / 2, 0),
            width: width("Africa"),
            color: "#000000",
            zMaskRotation: -Math.PI * 3 / 4,
            maskLength: Math.PI,
            zIndex: 0,
        }),
        Ring({
            label: "Europe",
            data: data["Europe"],
            video: "/videos/europe.mp4",
            shape: "/shapes/europe.svg",
            position: new Vector3(-xSpacing,baseHeight + ySpacing / 2, 0),
            width: width("Europe"),
            color: "#5eaaca",
            zMaskRotation: -Math.PI/4,
            maskLength: Math.PI/2,
            zIndex: 0,
        }),
        Ring({
            label: "America",
            data: data["America"],
            video: "/videos/america.mp4",
            shape: "/shapes/america.svg",
            position: new Vector3(xSpacing,baseHeight + ySpacing / 2, 0),
            width: width("America"),
            color: "#e5303d",
            zMaskRotation: -Math.PI * 4 / 5,
            maskLength: Math.PI * 2 / 3,
            zIndex: 0,
        }),
        Ring({
            label: "Oceania",
            data: data["Oceania"],
            video: "/videos/oceania.mp4",
            shape: "/shapes/oceania.svg",
            position: new Vector3(xSpacing / 2,baseHeight - ySpacing / 2, 0),
            width: width("Oceania"),
            color: "#499d6e",
            zMaskRotation: Math.PI * 4 / 5,
            maskLength: Math.PI/2,
            zIndex: 1,
        }),
        Ring({
            label: "Asia",
            data: data["Asia"],
            video: "/videos/asia.mp4",
            shape: "/shapes/asia.svg",
            position: new Vector3(-xSpacing / 2,baseHeight - ySpacing / 2,0),
            width: width("Asia"),
            color: "#fac531",
            zMaskRotation: Math.PI * 0.5,
            maskLength: 0,
            zIndex: 1,
        })
    ]
}