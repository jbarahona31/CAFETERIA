# 🚀 Quick Start - Modelos 3D

## ✅ Lo Que Está Listo

- ✅ Dependencias instaladas (`@react-three/fiber`, `@react-three/drei`, `three`)
- ✅ Componente `Model3D.jsx` creado y funcionando
- ✅ Carpetas `/public/models/` configuradas
- ✅ Documentación completa disponible
- ✅ Página demo creada (Modelo3DDemo.jsx)
- ✅ Ejemplos de integración en ProductCard

## 🎯 Próximos Pasos

### 1️⃣ Obtener un Modelo 3D de Prueba

**Opción A - Descargar modelo gratis:**
```bash
# Descargar desde Sketchfab (ejemplo)
# 1. Visita https://sketchfab.com/feed
# 2. Busca "t-shirt" o "coffee cup"
# 3. Filtra por "Downloadable"
# 4. Descarga en formato .glb
```

**Opción B - Usar modelo de prueba de glTF:**
```bash
cd frontend/public/models/uniformes
wget https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb
```

### 2️⃣ Probar el Visualizador

```jsx
// En cualquier página o componente:
import Model3D from '../components/Model3D';

<Model3D modelPath="/models/uniformes/Box.glb" />
```

### 3️⃣ Ver la Página Demo

Agrega esta ruta en tu `App.jsx`:

```jsx
import Modelo3DDemo from './pages/Modelo3DDemo';

<Route path="/demo-3d" element={<Modelo3DDemo />} />
```

Luego visita: `http://localhost:5173/demo-3d`

## 📋 Comandos Útiles

```bash
# Instalar dependencias (ya hecho)
npm install @react-three/fiber @react-three/drei three --legacy-peer-deps

# Ejecutar desarrollo
npm run dev

# Build para producción
npm run build

# Ver estructura de modelos
ls -la frontend/public/models/
```

## 🎨 Uso Básico del Componente

```jsx
import Model3D from '../components/Model3D';

// Uso simple
<Model3D modelPath="/models/uniformes/camiseta.glb" />

// Con Suspense (recomendado)
import { Suspense } from 'react';

<Suspense fallback={<div>Cargando...</div>}>
  <Model3D modelPath="/models/uniformes/camiseta.glb" />
</Suspense>
```

## 📂 Estructura de Archivos

```
CAFETERIA/
├── MODELO_3D_GUIA.md              # 📖 Documentación completa
├── frontend/
│   ├── public/
│   │   └── models/                # 📁 Coloca tus .glb aquí
│   │       ├── README.md
│   │       ├── uniformes/
│   │       ├── gorras/
│   │       ├── vasos/
│   │       └── estampados/
│   └── src/
│       ├── components/
│       │   ├── Model3D.jsx        # ⭐ Componente principal
│       │   └── ProductCard3DExample.jsx  # 💡 Ejemplos
│       └── pages/
│           └── Modelo3DDemo.jsx   # 🎨 Página de demostración
```

## 🔧 Personalización Rápida

### Cambiar tamaño del visor:
```jsx
// En Model3D.jsx, línea 11:
<div style={{ height: "600px" }}> {/* Era 400px */}
```

### Ajustar escala del modelo:
```jsx
// En Model3D.jsx, línea 7:
return <primitive object={scene} scale={2} />; {/* Era 1.5 */}
```

### Más luz:
```jsx
// En Model3D.jsx, líneas 13-14:
<ambientLight intensity={1.2} />  {/* Era 0.7 */}
<directionalLight position={[5, 5, 5]} intensity={2} />  {/* Era 1 */}
```

## 🐛 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| Modelo no se ve | Verifica la ruta del archivo .glb |
| Pantalla negra | Aumenta la intensidad de luz |
| Modelo muy grande/pequeño | Ajusta el `scale` |
| Error "Module not found" | Verifica instalación de dependencias |
| Build falla | Usa `--legacy-peer-deps` en npm install |

## 📚 Documentación Disponible

- **MODELO_3D_GUIA.md** - Guía completa paso a paso
- **frontend/public/models/README.md** - Gestión de archivos 3D
- **ProductCard3DExample.jsx** - Ejemplos de integración
- **Modelo3DDemo.jsx** - Demo interactiva

## ⚡ Atajos Rápidos

```bash
# Ver la demo
npm run dev
# Visita: http://localhost:5173/demo-3d

# Verificar que todo funciona
npm run build

# Agregar un modelo de prueba
cd frontend/public/models/uniformes
# Coloca tu archivo .glb aquí
```

## ✨ Características Incluidas

- ✅ Rotación 360° con mouse
- ✅ Zoom con scroll
- ✅ Iluminación configurable
- ✅ Responsive (móvil y desktop)
- ✅ Carga optimizada con Suspense
- ✅ Fácil integración en ProductCard
- ✅ Compatible con archivos .glb de hasta 10MB

## 🎯 Para Empezar AHORA

```bash
# 1. Descarga un modelo de prueba
cd frontend/public/models/uniformes
curl -L -o Box.glb "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb"

# 2. Prueba en código
echo 'import Model3D from "./components/Model3D";
<Model3D modelPath="/models/uniformes/Box.glb" />' 

# 3. Ejecuta
npm run dev
```

## 🆘 ¿Necesitas Ayuda?

1. Lee **MODELO_3D_GUIA.md** (guía completa)
2. Revisa los ejemplos en **ProductCard3DExample.jsx**
3. Visita la página demo en `/demo-3d`
4. Consulta la documentación de [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

---

**¡Todo listo para visualizar productos en 3D! 🎉**

_Última actualización: 2026-01-08_
