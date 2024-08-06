import "@Styles/ring.css";
import "@Utils/time";
import { MathUtils, Mesh, MeshBasicMaterial, RingGeometry, TorusGeometry, Vector3 } from "three";
import { backgroundColor, setBackgroundColor } from "@Components/card";
import { setVideoUrl, videoUrl } from "@Components/video";
import { useWindow } from "@Hooks/window";
import { useEffect } from "@Hooks/signal";
import { useFrame } from "@Hooks/frame";
import { useHover } from "@Hooks/hover";
import { useScene } from "@Hooks/scene";

type RingProps = {
    video: string,
    shape: string,
    label: string,
    data: any,
    position: Vector3,
    zMaskRotation: number,
    maskLength: number,
    color: string,
    width: number,
    zIndex: number,
}

export default async function Ring({
    position,
    color,
    width,
    zMaskRotation,
    maskLength,
    zIndex,
    video,
    label,
    data,
    shape
}: RingProps) {

    const { fov } = useWindow();
    const { scene, camera } = useScene();

    const isHex = window.location.pathname !== "/circles";
    const radius = 0.7;
    const segments = isHex ? 6 : 50;
    const delay = Math.random() * 1500;

    const geometry = new TorusGeometry(radius, width / 2, 8, segments);
    const material = new MeshBasicMaterial({
        color: color,
        depthTest: false,
        depthWrite: false,
        fog: true,
    });

    const ring = new Mesh(geometry, material);
    let mask: Mesh<RingGeometry, MeshBasicMaterial>, maskOpacity = 0;
    const renderOrder = () => 99999 + zIndex;

    ring.renderOrder = renderOrder();
    ring.castShadow = true;

    if(maskLength > 0){
        const maskGeometry = new RingGeometry(radius - width / 2, radius + width / 2, segments / 2, 0, 0, isHex ? Math.PI : maskLength);
        mask = new Mesh(maskGeometry, material.clone());
        mask.material.transparent = true;
        mask.material.opacity = maskOpacity;
        setTimeout(() => maskOpacity = 1, 3000);
        mask.renderOrder = renderOrder() + 20;
        mask.rotation.z = zMaskRotation;
        ring.add(mask);
    }

    const targetRotation = ring.quaternion.clone();
    const targetScale = ring.scale.clone();

    const randomRange = Math.PI * 10;
    ring.position.y = -1000;
    ring.rotation.x = Math.random() * randomRange - randomRange / 2;
    ring.rotation.y = Math.random() * randomRange - randomRange / 2;
    ring.rotation.z = Math.random() * randomRange - randomRange / 2;
    setTimeout(() => ring.position.copy(camera.position).multiplyScalar(1.3), 100)
    scene.add(ring);

    const ringHover = document.createElement('div')
    ringHover.classList.add('ringHover');

    ringHover.style.top = 'calc(50% + 2.8vh)';
    ringHover.style.zIndex = (10 + zIndex) + "";

    const ringData = document.createElement('div')
    ringData.classList.add('ringData');
    ringData.style.top = 'calc(50% + 2.8vh)';
    
    const ringTitle = document.createElement('div')
    ringTitle.classList.add('ringTitle');
    ringTitle.style.color = color;
    ringTitle.innerHTML = `${s(label)}: <span style="font-weight:800">${s(data.total) || 0}</span>`
    
    const ringMedals = document.createElement('div')
    ringMedals.classList.add('ringMedals');
   
    const gold = document.createElement('div')
    gold.innerHTML = `<div class="medalIcon"></div><div>${s(data.gold) || 0}</div>`
    const silver = document.createElement('div')
    silver.innerHTML = `<div class="medalIcon"></div><div>${s(data.silver) || 0}</div>`
    const bronze = document.createElement('div')
    bronze.innerHTML = `<div class="medalIcon"></div><div>${s(data.bronze) || 0}</div>`
    
    const toCss = () => `19.2vh / ${fov()}`;
    
    useEffect(() => {
        ringHover.style.transform = `translate(calc(-50% + ${position.x} * ${toCss()}), calc(-50% - 1.7vh - ${position.y} * ${toCss()}))`;
        ringHover.style.width = `calc((${radius} + ${width} / 2) * ${toCss()} * 2)`;
        ringHover.style.height = `calc((${radius} + ${width} / 2) * ${toCss()} * 2)`;
        ringData.style.transform = `translate(calc(-50% + ${position.x} * ${toCss()}), calc(-50% - ${position.y} * ${toCss()} + (${radius} * ${toCss()} + var(--ringDataDistance)) * ${position.y > 0 ? -1 : 0.8}))`;
    })

    useFrame.Delay(delay)((delta: any) => {
        ring.position.lerp(position, delta * 2);
        ring.scale.lerp(targetScale, delta * 2);
        ring.quaternion.slerp(targetRotation, delta * 0.8);
        mask && (mask.material.opacity = MathUtils.lerp(mask.material.opacity, maskOpacity, delta));
    })

    useHover.Delay(1500)(ringHover, () => {
        targetScale.set(1.1, 1.1, 1.1);
        if(backgroundColor() !== color) setBackgroundColor(color);
        if(videoUrl() !== video) setVideoUrl(video);
    }, () => {
        targetScale.set(1, 1, 1);
        if(backgroundColor() === color) setBackgroundColor("");
        if(videoUrl() === video) setVideoUrl("");
    }) 

    setTimeout(() => {
        ringMedals.appendChild(gold);
        ringMedals.appendChild(silver);
        ringMedals.appendChild(bronze);
        ringData.appendChild(ringTitle)
        ringData.appendChild(ringMedals)
    }, delay)
        
    setTimeout(() => {
        const ringShape = document.createElement('div')
        ringShape.classList.add('ringShape');
        ringShape.style.backgroundImage = `url(${shape})`;
        ringHover.appendChild(ringShape);
    }, 1000)
    
    return [
        ringData,
        ringHover,
    ]
}

const s = (text: number | string) => text?.toString()?.replace?.(/[<>\(\){}\.\[\]"'\\\/]+/g, '');