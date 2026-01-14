#!/usr/bin/env node

/**
 * 🔄 Script para actualizar URLs en archivos HTML estáticos
 * 
 * Uso: 
 *   node scripts/update-html-urls.cjs <BACKEND_URL>
 * 
 * Ejemplo:
 *   node scripts/update-html-urls.cjs https://cafeteria.up.railway.app
 */

const fs = require('fs');
const path = require('path');

// Obtener URL del backend desde argumentos
const backendURL = process.argv[2];

if (!backendURL) {
  console.error('❌ Error: Debes proporcionar la URL del backend');
  console.log('\n📖 Uso:');
  console.log('  node scripts/update-html-urls.cjs <BACKEND_URL>\n');
  console.log('📝 Ejemplo:');
  console.log('  node scripts/update-html-urls.cjs https://cafeteria.up.railway.app\n');
  process.exit(1);
}

// Validar URL
try {
  new URL(backendURL);
} catch (error) {
  console.error('❌ Error: URL inválida');
  process.exit(1);
}

// Archivos HTML a actualizar
const htmlFiles = [
  'public/admin.html',
  'public/login.html',
  'public/mesero.html',
  'public/registro.html'
];

const API_URL = `${backendURL}/api`;

console.log('🔄 Actualizando archivos HTML...\n');
console.log(`📍 Backend URL: ${backendURL}`);
console.log(`📍 API URL: ${API_URL}\n`);

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Saltando ${file} (no existe)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Patrón para encontrar y reemplazar la configuración de API_URL
    const pattern = /const API_URL = window\.location\.hostname === 'localhost'\s*\?\s*'http:\/\/localhost:4000\/api'\s*:\s*'[^']+'/g;
    
    const replacement = `const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:4000/api' : '${API_URL}'`;
    
    const newContent = content.replace(pattern, replacement);
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Actualizado: ${file}`);
      updatedCount++;
    } else {
      console.log(`⚠️ No se encontró el patrón en: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error.message);
  }
});

console.log(`\n🎉 Proceso completado: ${updatedCount} archivos actualizados`);

if (updatedCount === 0) {
  console.log('\n💡 Tip: Verifica que los archivos HTML tengan el formato esperado');
}
