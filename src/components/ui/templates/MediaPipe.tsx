import { useEffect, useRef, useState } from "react"

const MODEL_PATH = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"

export const MediaPipe = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number | null>(null);
    const landmarkerRef = useRef<any>(null);

    const [fps, setFps] = useState(0);
    const [running, setRunning] = useState(false)

    useEffect(() => {
        start();
        return () => {
            // stop();
        }
    },[])

    const loadModel = async () => {
        if(landmarkerRef.current) return landmarkerRef.current;

        try{
            const mp = await import("@mediapipe/tasks-vision");
            const { FaceLandmarker, FilesetResolver } = mp;

            const fileset = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );
            const landmarker = await FaceLandmarker.createFromOptions(fileset, {
                baseOptions: {
                    modelAssetPath: MODEL_PATH,
                },
                runningMode: "VIDEO",
                numFaces: 1,
                outputFaceBlendshapes: false,
                outputFacialTransformationMatrixes: false,
            })
            console.log('FaceLandmarker loaded:', landmarker);
            landmarkerRef.current = landmarker;
            return landmarker
        }catch(e){
            console.error("Error loading model:", e);
            throw e;
        }
    }
    
    const start = async () => {
        if (running) return;
        setRunning(true);

        console.log("Starting...");

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas ? canvas.getContext("2d") : null;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: false
            });
            if (video) {
                video.srcObject = stream;
                await video.play();
            }
        } catch (e) {
            console.error("Camera error:", e);
            setRunning(false);
            return;
        }

        // Resize canvas to match video
        if (canvas) {
            canvas.width = video?.videoWidth || 640;
            canvas.height = video?.videoHeight || 480;
        }

        const landmarker = await loadModel();

        let lastTs = performance.now();
        let frameCount = 0;
        let fpsWindowTs = lastTs;

        async function frame() {
            if (!running) return;

            // draw the video frame to an offscreen canvas if needed, but FaceLandmarker can accept HTMLVideoElement
            try {
                console.log('Calling detectForVideo...');
                // Use FaceLandmarker type only
                const results = await (landmarker as any).detectForVideo(video, performance.now());
                console.log('detectForVideo returned:', results);
                if (video && canvas && ctx) {
                    // Ensure canvas size matches video every frame
                    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                        canvas.width = video.videoWidth || 640;
                        canvas.height = video.videoHeight || 480;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    if (results && results.faceLandmarks && results.faceLandmarks.length) {
                        for (const face of results.faceLandmarks) {
                            console.log('faceLandmarks:', face);
                            drawLandmarks(ctx, face, canvas.width, canvas.height);
                        }
                    } else {
                        console.log('No faceLandmarks detected');
                    }
                } else throw new Error("Video or canvas not ready");
            } catch (e) {
                console.error("Error during detection:", e);
            }

            // FPS calc
            frameCount++;
            const now = performance.now();
            if (now - fpsWindowTs >= 500) {
                setFps(Math.round((frameCount * 1000) / (now - fpsWindowTs)));
                fpsWindowTs = now;
                frameCount = 0;
            }

            rafRef.current = requestAnimationFrame(frame);
        }

        rafRef.current = requestAnimationFrame(frame);
    }

    const stop = () => {
        setRunning(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;

        // stop camera
        const video = videoRef.current;
        if (video && video.srcObject && "getTracks" in video.srcObject) {
            const tracks = (video.srcObject as MediaStream).getTracks();
            tracks.forEach((t: MediaStreamTrack) => t.stop());
            video.srcObject = null;
        }

        // close model
        if (landmarkerRef.current) {
            try {
                landmarkerRef.current.close();
            } catch (e) {}
            landmarkerRef.current = null;
        }
    }

    const drawLandmarks = (
        ctx: CanvasRenderingContext2D,
        landmarks: Array<{ x: number; y: number; z?: number }>,
        w: number,
        h: number
    ) => {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#ff3366"; // 輪郭線を強調
        ctx.fillStyle = "rgba(255,51,102,0.2)"; // 輪郭内を薄く塗りつぶす

        // 顔ランドマークのバウンディングボックスで四角形を描画
        if (landmarks.length > 0) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const p of landmarks) {
                const x = p.x * w;
                const y = p.y * h;
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
            ctx.save();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#00ff00"; // 緑色
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.rect(minX, minY, maxX - minX, maxY - minY);
            ctx.stroke();
            ctx.restore();
        }
    }

    return (
        <>
            <video
                ref={videoRef}
                className="rounded-md absolute top-0 left-0 w-full h-full object-cover"
                style={{ display: "block" }}
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                className="rounded-md absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 2 }}
            />
        </>
    )
}