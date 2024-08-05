import { Fog as ThreeFog } from "three";
import { useScene } from "@Hooks/scene";

export default function Fog() {
    const { scene } = useScene();

    const fogNear = 300;
    const fogFar = 330;

    scene.fog = new ThreeFog(0xfbf9f9, fogNear, fogFar);
}