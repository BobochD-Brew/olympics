import { AmbientLight, Clock, DirectionalLight, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { updateFunctions } from "./frame";
import { useEffect } from "./signal";
import { useWindow } from "./window";

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;

export function useScene() {
    if(!scene || !camera || !renderer) throw new Error('Scene not created yet');
    
    return {
        scene,
        camera,
        renderer,
    }
}

export function createSceneIn(parent: HTMLElement) {
    const { ratio, fov } = useWindow();

    scene = new Scene();
    
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfbf9f9, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    
    camera = new PerspectiveCamera(fov(), ratio(), 10, 350);
    camera.position.z = 300;

    useEffect(() => camera.fov = fov())

    useEffect(() => {
        camera.aspect = ratio();
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })

    const canvas = document.createElement('div')
    canvas.classList.add("canvas");
    canvas.appendChild(renderer.domElement);
    parent.appendChild(canvas);

    const ambientLight = new AmbientLight(0xfbf9f9, 2.5);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xfbf9f9, 1.0);
    directionalLight.position.set(5, 2, 5);
    directionalLight.lookAt(new Vector3());
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const clock = new Clock();
    let delta = 0;

    function animate() {
        delta = Math.min(0.3, clock.getDelta());
        for(let i = 0; i < updateFunctions.length; i++) updateFunctions[i](delta);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
}