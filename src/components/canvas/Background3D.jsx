import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// A modern "tech" background using a connected network of nodes
const TechNetwork = () => {
    const pointsRef = useRef();
    const linesRef = useRef();
    const { mouse, viewport } = useThree();

    const particleCount = 250;
    const maxDistance = 3.5;

    // Generate random nodes within a contained volume
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = [];
        for (let i = 0; i < particleCount; i++) {
            // Spread nodes across viewing plane, slightly deep in Z
            pos[i * 3] = (Math.random() - 0.5) * 30;     // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

            // Slow random drift velocities
            vel.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            });
        }
        return { positions: pos, velocities: vel };
    }, []);

    // Create line segment geometry and materials
    const linesGeo = useMemo(() => new THREE.BufferGeometry(), []);
    const linesMat = useMemo(() => new THREE.LineBasicMaterial({
        color: '#3b82f6',
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }), []);


    useFrame(({ clock }) => {
        if (!pointsRef.current) return;

        const positionsArr = pointsRef.current.geometry.attributes.position.array;

        // Target cursor influence position mapped to 3D world space
        const targetX = (mouse.x * viewport.width) / 2;
        const targetY = (mouse.y * viewport.height) / 2;

        let linePositions = [];

        for (let i = 0; i < particleCount; i++) {
            let idx = i * 3;

            // Apply drift velocity
            positionsArr[idx] += velocities[i].x;
            positionsArr[idx + 1] += velocities[i].y;
            positionsArr[idx + 2] += velocities[i].z;

            // Bounce off boundaries to keep them on screen
            if (positionsArr[idx] > 15 || positionsArr[idx] < -15) velocities[i].x *= -1;
            if (positionsArr[idx + 1] > 10 || positionsArr[idx + 1] < -10) velocities[i].y *= -1;
            if (positionsArr[idx + 2] > 5 || positionsArr[idx + 2] < -15) velocities[i].z *= -1;

            // Calculate distance to mouse cursor for subtle repel effect
            const dxMouse = positionsArr[idx] - targetX;
            const dyMouse = positionsArr[idx + 1] - targetY;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            // Subtle "breathing" or repelling from cursor
            if (distMouse < 4) {
                const force = (4 - distMouse) * 0.01;
                positionsArr[idx] += (dxMouse / distMouse) * force;
                positionsArr[idx + 1] += (dyMouse / distMouse) * force;
            }

            // Connection Lines logic (O(N^2) optimization: break early if too far)
            for (let j = i + 1; j < particleCount; j++) {
                let jIdx = j * 3;
                const dx = positionsArr[idx] - positionsArr[jIdx];
                const dy = positionsArr[idx + 1] - positionsArr[jIdx];
                const dz = positionsArr[idx + 2] - positionsArr[jIdx];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < maxDistance * maxDistance) {
                    linePositions.push(
                        positionsArr[idx], positionsArr[idx + 1], positionsArr[idx + 2],
                        positionsArr[jIdx], positionsArr[jIdx + 1], positionsArr[jIdx + 2]
                    );
                }
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Update lines
        linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Slowly rotate entire system
        pointsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.1) * 0.1;
        pointsRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.1) * 0.05;
        if (linesRef.current) {
            linesRef.current.rotation.y = pointsRef.current.rotation.y;
            linesRef.current.rotation.x = pointsRef.current.rotation.x;
        }
    });

    return (
        <group>
            {/* The Tech Nodes */}
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.06}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            {/* The Tech Network Lines */}
            <lineSegments ref={linesRef} geometry={linesGeo} material={linesMat} frustumCulled={false} />
        </group>
    );
};

const Background3D = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none',
            background: 'var(--bg-primary)'
        }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <TechNetwork />
            </Canvas>
            {/* Vignette/Fade Overlay for depth processing */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default Background3D;
