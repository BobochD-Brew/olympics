import { Euler, Quaternion, Vector3 } from "three";
import { createSceneIn } from "@Hooks/scene";
import { useFrame } from "@Hooks/frame";
import { useMouse } from "@Hooks/mouse";
import { DOM } from "@Utils/dom";

type LazyCardProps = {
    cardContent: HTMLElement,
    cardTilt: HTMLElement,
    lazyChilds: DOM[]
}

export default function LazyCard({ cardContent, cardTilt, lazyChilds }: LazyCardProps) {
    createSceneIn(cardContent);

    const xTiltRange = 0.2;
    const yTiltRange = 0.2;
    const lightDirection = new Vector3(1, 0, 0);

    const currentRotation = new Quaternion();
    const targetRotation = new Quaternion();
    const angularVelocity = new Quaternion();
    const tmpQuaternion = new Quaternion();
    const tmpVector = new Vector3();
    const tmpVector2 = new Vector3();
    const tmpEuler = new Euler();

    const damping = 0.99;
    const spinForce = 0.0002;

    useMouse(({ x, y }) => {
        let posOnScreenX = ((x) / window.innerWidth) * 2 - 1;
        let posOnScreenY = ((y) / window.innerHeight) * 2 - 1;
        posOnScreenX = Math.min(1, Math.max(posOnScreenX, -1), 1);
        posOnScreenY = Math.min(1, Math.max(posOnScreenY, -1), 1);
        targetRotation.setFromEuler(tmpEuler.set(-posOnScreenY * yTiltRange, posOnScreenX * xTiltRange, 0));
    })

    useFrame((delta) => {
        tmpQuaternion.copy(angularVelocity);
        currentRotation.multiply(tmpQuaternion);
        currentRotation.slerp(tmpQuaternion, delta);
        currentRotation.slerp(targetRotation, delta);
        angularVelocity.slerp(new Quaternion(), 1 - damping);

        const [x, y, z, w] = currentRotation.toArray();
        cardTilt.style.transform = `perspective(400vh) matrix3d(
            ${1-2*y*y-2*z*z}, ${2*x*y+2*w*z}, ${2*x*z-2*w*y}, 0,
            ${2*x*y-2*w*z}, ${1-2*x*x-2*z*z}, ${2*y*z+2*w*x}, 0,
            ${2*x*z+2*w*y}, ${2*y*z-2*w*x}, ${1-2*x*x-2*y*y}, 0,
            0, 0, 0, 1
        )`;

        tmpVector.set(0, 0, 1).applyQuaternion(currentRotation);
        const dot = tmpVector.dot(lightDirection);
        const brightness = 1 + dot * 0.5;
        cardTilt.style.filter = `brightness(${brightness})`;
    })

    const handleClick = (event: MouseEvent | TouchEvent) => {
        const rect = cardTilt.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const isTouch = event instanceof TouchEvent;
        const clickX = (isTouch ? event.touches[0].clientX : event.clientX) - centerX;
        const clickY = (isTouch ? event.touches[0].clientY : event.clientY) - centerY;
        const angle = spinForce * Math.sqrt(clickX*clickX + clickY*clickY) / Math.sqrt(rect.width*rect.width + rect.height*rect.height);
        tmpQuaternion.setFromUnitVectors(tmpVector.set(1, 0, 0), tmpVector2.set(1, 0, -clickX * angle));
        angularVelocity.multiply(tmpQuaternion);
        tmpQuaternion.setFromUnitVectors(tmpVector.set(0, 1, 0), tmpVector2.set(0, 1, -clickY * angle));
        angularVelocity.multiply(tmpQuaternion);
    }
    
    cardTilt.addEventListener('click', handleClick);
    cardTilt.addEventListener('touchstart', handleClick);

    return lazyChilds;
}