import { Mesh, ShaderMaterial, PlaneGeometry, UniformsLib, Color, MathUtils } from "three";
import { fragmentShader, vertexShader } from "./shader";
import { backgroundColor } from "@Components/card";
import { useEffect } from "@Hooks/signal";
import { useWindow } from "@Hooks/window";
import { useFrame } from "@Hooks/frame";
import { useScene } from "@Hooks/scene";

export default function Mountains() {
    const { scene } = useScene();
    const { fov } = useWindow();

    const speed = 1;
    const scale = 2.5;
    const spacialFrequency = 0.5;
    const width = 20;
    const depth = 70;
    const widthRes = 15;
    const depthRes = 15;

    const targetColor = new Color();
    let opacity = 0;

    const uniforms = {
        ...UniformsLib.lights,
        ...UniformsLib.fog,
        opacity: { value: opacity },
        speed: { value: speed },
        scale: { value: scale },
        frequency: { value: spacialFrequency },
        color: { value: targetColor.clone() },
        time: { value: 0 },
    }
    
    const planeGeometry = new PlaneGeometry(width, depth, width * widthRes, depth * depthRes);
    const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        fog: true,
        lights: true,
        depthTest: false,
        depthWrite: false,
    });

    const moutains = new Mesh(planeGeometry, material);
    moutains.receiveShadow = true;
    moutains.rotation.x = -Math.PI / 2;
    moutains.position.y = -3;
    
    useEffect(() => {
        moutains.position.y = -3 - Math.max(0, fov() - 1.5) * 3;
        uniforms.scale.value = scale * Math.max(1, fov() - 0.5);
        uniforms.frequency.value = spacialFrequency / Math.max(1, (fov() - 0.5) * 0.5);
    })

    useEffect(() => {
        const color = backgroundColor();
        targetColor.set(color || "#fbf9f9");
        opacity = color ? 0 : 1; 
    })

    useFrame((delta) => {
        uniforms.time.value += delta * 4;
        uniforms.color.value.lerp(targetColor, delta * 2);
        uniforms.opacity.value = MathUtils.lerp(uniforms.opacity.value, opacity, delta * 2);
    })

    opacity = 0;
    setTimeout(() => opacity = 1, 1000);

    scene.add(moutains);
}