import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { useAppContext } from '../context/AppContext';
import { ClothingCategory } from '../types';

// Avatar mesh component
const AvatarModel: React.FC<{ meshUrl: string; textureUrl: string }> = ({ meshUrl, textureUrl }) => {
  const { scene } = useGLTF(meshUrl);
  const texture = useTexture(textureUrl);
  const avatarRef = useRef<THREE.Group>(null);

  // Simple animation - subtle breathing effect
  useFrame(({ clock }) => {
    if (avatarRef.current) {
      const t = clock.getElapsedTime();
      avatarRef.current.position.y = Math.sin(t) * 0.05;
    }
  });

  React.useEffect(() => {
    // Apply texture to avatar
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  return <primitive ref={avatarRef} object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} />;
};

// Clothing mesh component
const ClothingModel: React.FC<{ meshUrl: string; textureUrl: string; category: ClothingCategory }> = ({
  meshUrl,
  textureUrl,
  category,
}) => {
  const { scene } = useGLTF(meshUrl);
  const texture = useTexture(textureUrl);
  const clothingRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    // Apply texture to clothing
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
        // Ensure transparency works for accessories
        if (category === 'accessories' || category === 'hijabs' || category === 'scarves') {
          child.material.transparent = true;
          child.material.opacity = 0.9;
        }
      }
    });
  }, [scene, texture, category]);

  return <primitive ref={clothingRef} object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} />;
};

// Main Avatar Viewer component
const AvatarViewer: React.FC = () => {
  const { state } = useAppContext();
  const controlsRef = useRef<any>(null);
  const [isRotating, setIsRotating] = useState(false);

  // Handle avatar rotation with button controls
  const handleRotateLeft = () => {
    if (controlsRef.current) {
      controlsRef.current.rotateY(0.3);
    }
  };

  const handleRotateRight = () => {
    if (controlsRef.current) {
      controlsRef.current.rotateY(-0.3);
    }
  };

  const handleAutoRotate = () => {
    if (controlsRef.current) {
      setIsRotating(!isRotating);
      controlsRef.current.autoRotate = !isRotating;
    }
  };

  if (!state.avatar) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Upload a photo to see your 3D avatar</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Avatar model */}
        <AvatarModel meshUrl={state.avatar.meshUrl} textureUrl={state.avatar.textureUrl} />
        
        {/* Clothing items */}
        {Object.entries(state.selectedClothing).map(([category, item]) => (
          <ClothingModel 
            key={category}
            meshUrl={item.meshUrl}
            textureUrl={item.textureUrl}
            category={category as ClothingCategory}
          />
        ))}
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={false}
          minDistance={1.5}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={isRotating}
          autoRotateSpeed={2}
        />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button 
          onClick={handleRotateLeft}
          className="bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition-all"
          aria-label="Rotate left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleAutoRotate}
          className={`${isRotating ? 'bg-primary text-white' : 'bg-white text-gray-800'} p-2 rounded-full shadow hover:bg-opacity-90 transition-all`}
          aria-label={isRotating ? "Stop rotation" : "Auto rotate"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button 
          onClick={handleRotateRight}
          className="bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition-all"
          aria-label="Rotate right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AvatarViewer; 