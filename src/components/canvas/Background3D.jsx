import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// A utility to generate random points in a sphere
const generateParticles = (count) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Random spherical distribution
        const r = 20 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return positions;
};

const ParticleSystem = () => {
    const pointsRef = useRef();

    // Memoize positions so they don't regenerate on every render
    const particlesPosition = useMemo(() => generateParticles(2000), []);

    // Subtle rotation for floating effect
    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x -= delta * 0.02;
            pointsRef.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#3b82f6" // Refined electric blue
                size={0.08}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

// Abstract geometric mesh
const AbstractShape = () => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[5, 1]} />
            <meshBasicMaterial
                color="#3b82f6"
                wireframe={true}
                transparent={true}
                opacity={0.05}
            />
        </mesh>
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
            background: 'radial-gradient(circle at center, #121212 0%, #0a0a0a 100%)'
        }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                {/* Soft lighting */}
                <ambientLight intensity={0.5} />
                <ParticleSystem />
                <AbstractShape />
            </Canvas>
            {/* Overlay to fade out the top/bottom for readability */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0) 20%, rgba(10,10,10,0) 80%, rgba(10,10,10,1) 100%)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default Background3D;
