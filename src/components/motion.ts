import { useFrame } from "@Hooks/frame";
import { useMouse } from "@Hooks/mouse";
import { useScene } from "@Hooks/scene";
import { Vector3 } from "three";

export default function Motion() {
    const { camera } = useScene();

    const xMoveRange = 5;
    const yMoveRange = 3;

    const targetPosition = camera.position.clone(); 
    const worldCenter = new Vector3();

    useFrame((delta) => {
        camera.position.lerp(targetPosition, 1 * delta);
        camera.lookAt(worldCenter);
    })

    useMouse(({ x, y }) => {
        let posOnScreenX = ((x) / window.innerWidth) * 2 - 1;
        let posOnScreenY = ((y) / window.innerHeight) * 2 - 1;
        posOnScreenX = Math.min(1, Math.max(posOnScreenX, -1), 1)
        posOnScreenY = Math.min(1, Math.max(posOnScreenY, -1), 1)
        targetPosition.set(posOnScreenX * xMoveRange, posOnScreenY * yMoveRange, targetPosition.z);
    })
}