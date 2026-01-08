# 📁 Modelos 3D

Este directorio contiene los modelos 3D (.glb) para visualizar productos en 3D.

## 📂 Estructura de Carpetas

```
models/
├─ uniformes/     # Modelos de uniformes (camisetas, etc.)
├─ gorras/        # Modelos de gorras
├─ vasos/         # Modelos de vasos
└─ estampados/    # Modelos de productos con estampados
```

## 🎨 Formato de Archivos

- **Formato requerido**: `.glb` (GL Transmission Format Binary)
- **Tamaño recomendado**: Menos de 10MB por archivo
- **Optimización**: Usar herramientas como [gltf-transform](https://gltf-transform.dev/) para comprimir

## 📥 Cómo Agregar un Modelo

1. Obtén o crea un modelo 3D en formato `.glb`
2. Coloca el archivo en la carpeta correspondiente
3. Usa el modelo en tu componente:

```jsx
import Model3D from '../components/Model3D';

<Model3D modelPath="/models/uniformes/camiseta.glb" />
```

## 🔧 Herramientas Recomendadas

### Para Crear Modelos 3D:
- [Blender](https://www.blender.org/) (Gratis, open source)
- [SketchUp](https://www.sketchup.com/)
- [Tinkercad](https://www.tinkercad.com/) (Online, fácil para principiantes)

### Para Convertir a .glb:
- [Blender](https://www.blender.org/) (File → Export → glTF 2.0)
- [gltf.report](https://gltf.report/) (Online converter)

### Para Optimizar:
- [gltf-transform](https://gltf-transform.dev/)
- [glTF-Compressor](https://github.khronos.org/glTF-Compressor-Release/)

## 📋 Buenas Prácticas

✅ **Hacer:**
- Mantener archivos bajo 10MB
- Usar texturas optimizadas (max 2048x2048px)
- Nombrar archivos descriptivamente (ej: `camiseta-roja.glb`)
- Probar en dispositivos móviles

❌ **Evitar:**
- Subir archivos muy pesados (+20MB)
- Usar texturas de muy alta resolución
- Modelos con demasiados polígonos (>100k)

## 🎯 Ejemplo de Integración

```jsx
// En una página de productos
import Model3D from '../components/Model3D';

function ProductPage() {
  return (
    <div>
      <h1>Camiseta Colombia</h1>
      <Model3D modelPath="/models/uniformes/camiseta.glb" />
      <p>Descripción del producto...</p>
    </div>
  );
}
```

## 🆘 Solución de Problemas

### Modelo no se visualiza
- Verifica que el archivo .glb esté en la carpeta correcta
- Confirma que la ruta en `modelPath` sea correcta
- Abre la consola del navegador para ver errores

### Modelo muy grande o pequeño
- Ajusta el prop `scale` en el componente ProductModel
- Ejemplo: `<primitive object={scene} scale={0.5} />` (más pequeño)
- Ejemplo: `<primitive object={scene} scale={2} />` (más grande)

### Modelo se ve negro
- Verifica la iluminación en Model3D.jsx
- Ajusta `ambientLight` y `directionalLight` intensity

## 📚 Recursos

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [React Three Drei](https://github.com/pmndrs/drei)
- [glTF Format Specification](https://www.khronos.org/gltf/)

---

**Nota**: Por ahora, este directorio contiene solo la estructura. Agrega tus modelos .glb según los necesites.
