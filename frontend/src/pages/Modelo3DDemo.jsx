import { Suspense } from 'react';
import Model3D from '../components/Model3D';
import './Modelo3DDemo.css';

/**
 * Página de demostración del sistema de visualización 3D
 * 
 * Esta página muestra cómo usar el componente Model3D para visualizar
 * productos en 3D. Actualmente muestra un placeholder hasta que se agreguen
 * modelos .glb reales.
 * 
 * Para usar esta página, agrega modelos .glb en:
 * - public/models/uniformes/
 * - public/models/gorras/
 * - public/models/vasos/
 * - public/models/estampados/
 */
function Modelo3DDemo() {
  return (
    <div className="modelo3d-demo-page">
      <div className="demo-header">
        <h1>🎨 Visualización 3D de Productos</h1>
        <p className="demo-description">
          Explora nuestros productos en 3D. Usa el mouse para rotar y hacer zoom.
        </p>
      </div>

      <div className="demo-instructions">
        <div className="instruction-card">
          <span className="icon">🖱️</span>
          <h3>Rotar</h3>
          <p>Click izquierdo + arrastrar</p>
        </div>
        <div className="instruction-card">
          <span className="icon">🔍</span>
          <h3>Zoom</h3>
          <p>Scroll del mouse</p>
        </div>
        <div className="instruction-card">
          <span className="icon">👆</span>
          <h3>Mover</h3>
          <p>Click derecho + arrastrar</p>
        </div>
      </div>

      <div className="demo-content">
        <section className="demo-section">
          <h2>Ejemplo: Visualizador 3D</h2>
          <div className="model-container">
            <div className="model-info">
              <h3>Cómo Funciona</h3>
              <p>
                El componente <code>Model3D</code> carga archivos .glb y los muestra
                de forma interactiva usando Three.js.
              </p>
              <h4>Características:</h4>
              <ul>
                <li>✅ Rotación libre con el mouse</li>
                <li>✅ Zoom in/out</li>
                <li>✅ Iluminación configurada</li>
                <li>✅ Carga optimizada</li>
                <li>✅ Responsive (móvil y desktop)</li>
              </ul>
            </div>
            
            <div className="model-viewer">
              <Suspense 
                fallback={
                  <div className="loading-3d">
                    <div className="spinner"></div>
                    <p>Cargando modelo 3D...</p>
                  </div>
                }
              >
                {/* 
                  Cuando agregues un modelo .glb real, usa:
                  <Model3D modelPath="/models/uniformes/camiseta.glb" />
                  
                  Por ahora, este es solo un ejemplo visual
                */}
                <div className="placeholder-3d">
                  <div className="placeholder-content">
                    <span className="placeholder-icon">📦</span>
                    <h3>Modelo 3D</h3>
                    <p>Agrega un archivo .glb en:</p>
                    <code>/public/models/uniformes/</code>
                    <p className="placeholder-hint">
                      Luego reemplaza este div con:
                    </p>
                    <code className="code-example">
                      &lt;Model3D modelPath="/models/..." /&gt;
                    </code>
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>Ejemplo de Integración en ProductCard</h2>
          <div className="code-example-block">
            <h3>Código de Ejemplo:</h3>
            <pre><code>{`import Model3D from '../components/Model3D';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.model3d_url ? (
        <Model3D modelPath={product.model3d_url} />
      ) : (
        <img src={product.imagen_url} alt={product.nombre} />
      )}
      <h3>{product.nombre}</h3>
      <p>{product.descripcion}</p>
    </div>
  );
}`}</code></pre>
          </div>
        </section>

        <section className="demo-section">
          <h2>📁 Estructura de Archivos</h2>
          <div className="file-structure">
            <pre>{`public/models/
├── uniformes/
│   └── camiseta.glb
├── gorras/
│   └── gorra.glb
├── vasos/
│   └── vaso.glb
└── estampados/
    └── camiseta-estampada.glb`}</pre>
          </div>
        </section>

        <section className="demo-section next-steps">
          <h2>🚀 Próximos Pasos</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Obtener Modelos 3D</h3>
              <p>Descarga o crea modelos .glb para tus productos</p>
              <a 
                href="https://sketchfab.com/feed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Explorar Sketchfab
              </a>
            </div>
            
            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Colocar en /public/models/</h3>
              <p>Organiza los modelos en las carpetas correspondientes</p>
            </div>
            
            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Actualizar el Código</h3>
              <p>Reemplaza el placeholder con el componente Model3D</p>
            </div>
            
            <div className="step-card">
              <span className="step-number">4</span>
              <h3>Probar y Optimizar</h3>
              <p>Verifica el rendimiento en móvil y desktop</p>
            </div>
          </div>
        </section>

        <section className="demo-section resources">
          <h2>📚 Recursos Útiles</h2>
          <div className="resources-list">
            <a href="https://docs.pmnd.rs/react-three-fiber" target="_blank" rel="noopener noreferrer">
              React Three Fiber Docs
            </a>
            <a href="https://github.com/pmndrs/drei" target="_blank" rel="noopener noreferrer">
              Drei Components
            </a>
            <a href="https://www.khronos.org/gltf/" target="_blank" rel="noopener noreferrer">
              glTF Format Specification
            </a>
            <a href="https://gltf.report/" target="_blank" rel="noopener noreferrer">
              glTF Validator & Converter
            </a>
          </div>
        </section>
      </div>

      <div className="demo-footer">
        <p>
          📖 Para más información, consulta el archivo <code>MODELO_3D_GUIA.md</code> en la raíz del proyecto.
        </p>
      </div>
    </div>
  );
}

export default Modelo3DDemo;
