
import React, { useEffect, useRef, useState } from 'react';
import { toCanvas } from 'html-to-image';

interface GenieCanvasProps {
    sourceRef: React.RefObject<HTMLDivElement | null>;
    triggerRect: DOMRect | null;
    isOpening: boolean;
    isClosing: boolean;
    onAnimationComplete: () => void;
}

const GenieCanvas: React.FC<GenieCanvasProps> = ({
    sourceRef,
    triggerRect,
    isOpening,
    isClosing,
    onAnimationComplete
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snapshot, setSnapshot] = useState<HTMLCanvasElement | null>(null);
    const [progress, setProgress] = useState(0);
    const animationFrameRef = useRef<number>(null);

    // Capture the snapshot
    useEffect(() => {
        let isMounted = true;
        if ((isOpening || isClosing) && sourceRef.current && !snapshot) {
            const element = sourceRef.current;
            const originalOpacity = element.style.opacity;
            const originalVisibility = element.style.visibility;

            element.style.opacity = '1';
            element.style.visibility = 'visible';

            toCanvas(element, {
                pixelRatio: 2,
                backgroundColor: 'transparent',
                style: {
                    transform: 'none',
                    margin: '0',
                }
            }).then(canvas => {
                if (!isMounted) return;
                setSnapshot(canvas);
                element.style.opacity = originalOpacity;
                element.style.visibility = originalVisibility;
                startAnimation();
            }).catch(err => {
                console.error("Snapshot failed:", err);
                onAnimationComplete(); // Fallback
            });
        }
        return () => { isMounted = false; };
    }, [isOpening, isClosing]);

    const startAnimation = () => {
        const startTime = performance.now();
        const duration = 500; // ms

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const p = Math.min(elapsed / duration, 1);

            // Premium Elastic Easing for opening, cubic for closing
            const elastic = (x: number): number => {
                const c4 = (2 * Math.PI) / 3;
                return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
            };

            const eased = isOpening ? elastic(p) : Math.pow(p, 2);
            const currentProgress = isOpening ? eased : (1 - eased);
            setProgress(currentProgress);

            if (p < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                onAnimationComplete();
                setSnapshot(null);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Draw the Genie effect
    useEffect(() => {
        if (!snapshot || !canvasRef.current || !triggerRect) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgW = snapshot.width / 2;
        const imgH = snapshot.height / 2;
        const finalX = (window.innerWidth - imgW) / 2;
        const finalY = (window.innerHeight - imgH) / 2;
        const targetX = triggerRect.left + triggerRect.width / 2;
        const targetY = triggerRect.top + triggerRect.height / 2;
        const t = progress;

        const slices = 120;
        for (let i = 0; i < slices; i++) {
            const ySliceNormalized = i / slices;
            const sy = ySliceNormalized * snapshot.height;
            const sh = snapshot.height / slices;

            const yStart = targetY + (finalY - targetY) * t;
            const yEnd = targetY + (finalY + imgH - targetY) * t;
            const currentY = yStart + ySliceNormalized * (yEnd - yStart);
            const sliceHeight = (yEnd - yStart) / slices;

            const isSuckingDown = targetY > window.innerHeight / 2;
            let widthFactor = t * (0.02 + 0.98 * Math.pow(isSuckingDown ? (1 - ySliceNormalized) : ySliceNormalized, Math.max(0.1, 1 - t)));

            const currentWidth = imgW * widthFactor;
            const currentCenterX = targetX + (window.innerWidth / 2 - targetX) * t;
            const currentX = currentCenterX - currentWidth / 2;

            // Subtle Warp shadow
            ctx.shadowBlur = 40 * t;
            ctx.shadowColor = `rgba(0, 0, 0, ${0.3 * t})`;
            ctx.shadowOffsetY = 10 * t;

            ctx.drawImage(
                snapshot,
                0, sy, snapshot.width, sh,
                currentX, currentY, currentWidth, sliceHeight + 0.6
            );
        }
    }, [snapshot, progress, triggerRect]);

    if (!snapshot) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[101]"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default GenieCanvas;
