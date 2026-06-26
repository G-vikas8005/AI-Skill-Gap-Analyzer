import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

const FloatingShape = () => {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#24B1B1" wireframe />
      </mesh>
    </Float>
  );
};

export default function Background3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />
        <FloatingShape />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}