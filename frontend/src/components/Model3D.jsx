import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function ProductModel({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} />;
}

export default function Model3D({ modelPath }) {
  return (
    <div style={{ height: "400px" }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ProductModel path={modelPath} />
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}
