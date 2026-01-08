import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";

function ProductModel({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} />;
}

function ErrorFallback() {
  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f5f5f5",
      borderRadius: "8px"
    }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#666", marginBottom: "0.5rem" }}>
          ⚠️ Error al cargar el modelo 3D
        </p>
        <p style={{ fontSize: "0.85rem", color: "#999" }}>
          Verifica que el archivo .glb existe en la ruta especificada
        </p>
      </div>
    </div>
  );
}

export default function Model3D({ modelPath }) {
  const [hasError, setHasError] = useState(false);

  // Validate modelPath prop
  if (!modelPath || typeof modelPath !== 'string' || modelPath.trim() === '') {
    console.error('Model3D: modelPath prop is required and must be a non-empty string');
    return <ErrorFallback />;
  }

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div style={{ height: "400px" }}>
      <Canvas 
        camera={{ position: [0, 1.5, 3] }}
        onError={(error) => {
          console.error('Model3D Canvas error:', error);
          setHasError(true);
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <ProductModel path={modelPath} />
        </Suspense>
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}
