# 🎨 Guía de Implementación de Modelos 3D

## 📌 Resumen

Se ha implementado un sistema de visualización 3D para productos usando **Three.js** y **React Three Fiber**. Este sistema permite cargar y mostrar modelos 3D en formato `.glb` con controles de rotación y zoom.

---

## ✅ Cambios Realizados

### 1️⃣ Dependencias Instaladas

```json
{
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^9.117.3",
  "three": "^0.171.0"
}
```

### 2️⃣ Nuevo Componente: `Model3D.jsx`

**Ubicación**: `/frontend/src/components/Model3D.jsx`

Este componente reemplaza el placeholder de caja (`boxGeometry`) por un cargador profesional de modelos 3D.

**Características**:
- ✅ Carga modelos `.glb` desde cualquier ruta
- ✅ Controles de rotación (OrbitControls)
- ✅ Zoom habilitado
- ✅ Iluminación configurada (ambiente + direccional)
- ✅ Cámara posicionada automáticamente

### 3️⃣ Estructura de Carpetas

```
frontend/public/models/
├── README.md              # Documentación de uso
├── uniformes/            # Modelos de uniformes
│   └── .gitkeep
├── gorras/               # Modelos de gorras
│   └── .gitkeep
├── vasos/                # Modelos de vasos
│   └── .gitkeep
└── estampados/           # Modelos con estampados
    └── .gitkeep
```

---

## 🚀 Cómo Usar el Componente

### Uso Básico

```jsx
import Model3D from '../components/Model3D';

function ProductPage() {
  return (
    <div>
      <Model3D modelPath="/models/uniformes/camiseta.glb" />
    </div>
  );
}
```

### Ejemplo con ProductCard

Si deseas agregar visualización 3D a las tarjetas de producto:

```jsx
import Model3D from './Model3D';

function ProductCard({ product }) {
  const hasModel = product.model3d_url; // Campo en la base de datos
  
  return (
    <div className="product-card">
      {hasModel ? (
        <Model3D modelPath={product.model3d_url} />
      ) : (
        <img src={product.imagen_url} alt={product.nombre} />
      )}
      {/* Resto del contenido */}
    </div>
  );
}
```

### Ejemplo en Página de Producto

```jsx
import Model3D from '../components/Model3D';

function UniformesPage() {
  return (
    <div className="uniformes-page">
      <h1>Uniformes Personalizados</h1>
      
      <section className="product-preview">
        <Model3D modelPath="/models/uniformes/camiseta.glb" />
        <div className="product-details">
          <h2>Camiseta Personalizada</h2>
          <p>Visualiza el producto en 3D. Usa el mouse para rotar.</p>
        </div>
      </section>
    </div>
  );
}
```

---

## 📁 Cómo Agregar Modelos 3D

### Paso 1: Obtener un Modelo .glb

**Opciones**:
1. **Crear en Blender** (gratis):
   - Diseñar modelo
   - File → Export → glTF 2.0 (.glb)

2. **Descargar modelos gratuitos**:
   - [Sketchfab](https://sketchfab.com/feed) (filtrar por "Downloadable")
   - [Poly Pizza](https://poly.pizza/)
   - [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)

3. **Contratar diseñador 3D**:
   - Fiverr
   - Upwork
   - Freelancer

### Paso 2: Optimizar el Modelo

```bash
# Instalar gltf-transform
npm install -g @gltf-transform/cli

# Optimizar modelo
gltf-transform optimize input.glb output.glb
```

**Checklist de optimización**:
- ✅ Tamaño < 10MB
- ✅ Texturas max 2048x2048px
- ✅ Polígonos < 100k
- ✅ Usar compresión Draco si es posible

### Paso 3: Colocar en la Carpeta Correcta

```bash
# Ejemplo para una camiseta
cp camiseta-colombia.glb frontend/public/models/uniformes/

# Ejemplo para una gorra
cp gorra-seleccion.glb frontend/public/models/gorras/
```

### Paso 4: Usar en el Código

```jsx
<Model3D modelPath="/models/uniformes/camiseta-colombia.glb" />
```

---

## 🎛️ Personalización Avanzada

### Ajustar la Escala del Modelo

Si el modelo se ve muy grande o pequeño, modifica `Model3D.jsx`:

```jsx
function ProductModel({ path, scale = 1.5 }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={scale} />;
}

export default function Model3D({ modelPath, scale }) {
  return (
    <div style={{ height: "400px" }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ProductModel path={modelPath} scale={scale} />
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}

// Uso:
<Model3D modelPath="/models/uniformes/camiseta.glb" scale={2} />
```

### Cambiar la Altura del Visor

```jsx
<Model3D modelPath="/models/uniformes/camiseta.glb" />

// En Model3D.jsx:
<div style={{ height: "600px" }}> {/* Era 400px */}
```

### Ajustar Iluminación

```jsx
// Más luz ambiente (más suave)
<ambientLight intensity={1.2} />

// Luz direccional más intensa
<directionalLight position={[5, 5, 5]} intensity={2} />

// Agregar luz adicional
<pointLight position={[-5, 5, 5]} intensity={0.5} />
```

### Desactivar Zoom

```jsx
<OrbitControls enableZoom={false} />
```

### Establecer Límites de Rotación

```jsx
<OrbitControls 
  enableZoom 
  maxPolarAngle={Math.PI / 2}  // No rotar más allá del horizonte
  minDistance={2}               // Zoom mínimo
  maxDistance={10}              // Zoom máximo
/>
```

---

## 🔧 Integración con Base de Datos (Opcional)

Si quieres almacenar la ruta del modelo 3D en la base de datos:

### 1. Agregar columna a la tabla

```sql
ALTER TABLE productos 
ADD COLUMN model3d_url VARCHAR(255) DEFAULT NULL;

-- Ejemplo de actualización
UPDATE productos 
SET model3d_url = '/models/uniformes/camiseta.glb' 
WHERE id = 1;
```

### 2. Mostrar condicionalmente

```jsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.model3d_url ? (
        <Model3D modelPath={product.model3d_url} />
      ) : (
        <img src={product.imagen_url} alt={product.nombre} />
      )}
      {/* ... */}
    </div>
  );
}
```

---

## 🐛 Solución de Problemas

### Problema 1: Modelo no se muestra

**Síntomas**: Pantalla en blanco o negra

**Soluciones**:
1. Verificar que el archivo .glb existe en la ruta correcta
2. Abrir consola del navegador (F12) para ver errores
3. Verificar que el modelo no está corrupto (abrirlo en Blender)

```bash
# Verificar que el archivo existe
ls -lh frontend/public/models/uniformes/camiseta.glb
```

### Problema 2: Modelo muy grande o muy pequeño

**Solución**: Ajustar la escala

```jsx
// Modelo muy grande → Reducir escala
<ProductModel path={modelPath} scale={0.5} />

// Modelo muy pequeño → Aumentar escala
<ProductModel path={modelPath} scale={3} />
```

### Problema 3: Modelo se ve oscuro o negro

**Solución**: Aumentar intensidad de luz

```jsx
<ambientLight intensity={1.5} />  {/* Era 0.7 */}
<directionalLight position={[5, 5, 5]} intensity={2} /> {/* Era 1 */}
```

### Problema 4: Error "Module not found"

**Síntomas**: `Cannot find module '@react-three/fiber'`

**Solución**:
```bash
cd frontend
npm install @react-three/fiber @react-three/drei three --legacy-peer-deps
```

### Problema 5: Modelo rota incorrectamente

**Solución**: Ajustar rotación inicial

```jsx
function ProductModel({ path }) {
  const { scene } = useGLTF(path);
  scene.rotation.y = Math.PI / 2; // Rotar 90 grados
  return <primitive object={scene} scale={1.5} />;
}
```

### Problema 6: Rendimiento lento en móvil

**Soluciones**:
1. Optimizar el modelo (menos polígonos)
2. Comprimir texturas
3. Usar Draco compression
4. Cargar bajo demanda

```jsx
import { Suspense } from 'react';

<Suspense fallback={<div>Cargando modelo 3D...</div>}>
  <Model3D modelPath="/models/uniformes/camiseta.glb" />
</Suspense>
```

---

## 📊 Rendimiento y Optimización

### Cargar Modelos Bajo Demanda

```jsx
import { Suspense, lazy } from 'react';

const Model3D = lazy(() => import('./Model3D'));

function ProductPage() {
  const [show3D, setShow3D] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShow3D(true)}>
        Ver en 3D
      </button>
      
      {show3D && (
        <Suspense fallback={<div>Cargando...</div>}>
          <Model3D modelPath="/models/uniformes/camiseta.glb" />
        </Suspense>
      )}
    </div>
  );
}
```

### Precargar Modelos

```jsx
import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function App() {
  useEffect(() => {
    // Precargar modelos importantes
    useGLTF.preload('/models/uniformes/camiseta.glb');
    useGLTF.preload('/models/gorras/gorra.glb');
  }, []);
  
  return <div>...</div>;
}
```

---

## 📱 Responsive Design

### Ajustar altura según dispositivo

```jsx
const Model3D = ({ modelPath }) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div style={{ height: isMobile ? "300px" : "400px" }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        {/* ... */}
      </Canvas>
    </div>
  );
};
```

---

## ✅ Checklist de Implementación

Después de seguir esta guía, deberías tener:

- [x] Dependencias de Three.js instaladas
- [x] Componente `Model3D.jsx` creado
- [x] Estructura de carpetas `/public/models/` configurada
- [ ] Al menos un modelo .glb de prueba cargado
- [ ] Componente `Model3D` integrado en una página
- [ ] Modelo visible y rotable en el navegador
- [ ] Optimización de rendimiento aplicada
- [ ] Documentación leída y entendida

---

## 📚 Recursos Adicionales

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Manual](https://threejs.org/manual/)
- [glTF Tutorial](https://www.khronos.org/gltf/)
- [Blender to glTF](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)

---

## 🎯 Próximos Pasos Recomendados

1. **Obtener modelos 3D** para tus productos principales
2. **Crear una página de demostración** de visualización 3D
3. **Agregar campo `model3d_url`** a la base de datos
4. **Integrar en `ProductCard`** como opción
5. **Optimizar modelos** para web (< 5MB ideal)
6. **Probar en dispositivos móviles**
7. **Agregar loading states** con Suspense
8. **Considerar screenshots 360°** como fallback

---

**Implementado para El Sabor Colombiano 🇨🇴**

_Cualquier duda, consultar este documento o los recursos enlazados._
