const pool = require('../config/database');

// Obtener ventas diarias
// Note: Order states used in the system: 'pendiente', 'preparando', 'listo', 'entregado', 'completado'
// Only 'completado' and 'entregado' orders are counted as completed sales
exports.getDailySales = async (req, res) => {
  try {
    console.log('[SalesController] Fetching daily sales...');
    
    // Query para obtener ventas del día actual agrupadas por producto
    const result = await pool.query(`
      SELECT 
        p.nombre as producto,
        p.categoria,
        COUNT(dp.id) as cantidad_vendida,
        SUM(p.precio * dp.cantidad) as total_ventas,
        DATE(ped.fecha_creacion) as fecha
      FROM pedidos ped
      JOIN detalle_pedido dp ON ped.id = dp.pedido_id
      JOIN productos p ON dp.producto_id = p.id
      WHERE DATE(ped.fecha_creacion) = CURRENT_DATE
      AND ped.estado IN ('completado', 'entregado')
      GROUP BY p.nombre, p.categoria, DATE(ped.fecha_creacion)
      ORDER BY total_ventas DESC
    `);
    
    // Calcular el total del día
    const totalResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT ped.id) as total_pedidos,
        SUM(p.precio * dp.cantidad) as total_ingresos
      FROM pedidos ped
      JOIN detalle_pedido dp ON ped.id = dp.pedido_id
      JOIN productos p ON dp.producto_id = p.id
      WHERE DATE(ped.fecha_creacion) = CURRENT_DATE
      AND ped.estado IN ('completado', 'entregado')
    `);
    
    console.log(`[SalesController] Found ${result.rows.length} products sold today`);
    
    res.json({
      fecha: new Date().toISOString().split('T')[0],
      resumen: {
        total_pedidos: parseInt(totalResult.rows[0]?.total_pedidos || 0),
        total_ingresos: parseFloat(totalResult.rows[0]?.total_ingresos || 0)
      },
      productos: result.rows
    });
  } catch (err) {
    console.error('[SalesController] Error fetching daily sales:', err);
    res.status(500).json({ error: 'Error obteniendo ventas diarias', details: err.message });
  }
};
