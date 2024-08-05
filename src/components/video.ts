import { createSignal, useEffect } from "@Hooks/signal";

const [ videoUrl, setVideoUrl ] = createSignal("");

export default function Video(target: HTMLDivElement) {
    let video: HTMLVideoElement | null;

    const removeVideo = () => {
        if(!video) return; 
        video.style.opacity = '0';
        const refCopy = video;
        setTimeout(() => refCopy.remove(), 3000);
        video = null;
    }

    const createVideo = () => {
        if(!videoUrl()) return;
        video = document.createElement('video') as HTMLVideoElement;
        video.classList.add('cardVideo');
        video.style.opacity = '0';
        video.src = videoUrl();
        video.playsInline = true;
        video.controls = false;
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        target.appendChild(video);
        const refCopy = video;
        setTimeout(() => refCopy.style.opacity = '1.0', 10);
        video.play();
    }

    useEffect(() => {
        removeVideo();
        createVideo();
    })
}

export { videoUrl, setVideoUrl }