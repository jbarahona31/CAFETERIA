import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

const SOCKET_URL = API_CONFIG.socketURL;

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      console.log('[Socket] Ya está conectado');
      return this.socket;
    }

    console.log('[Socket] Conectando a:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('[Socket] ✅ Conectado exitosamente:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] ❌ Error de conexión:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Desconectado:', reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('[Socket] Desconectando...');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  joinMeseros() {
    if (this.socket) {
      this.socket.emit('join_meseros');
      console.log('[Socket] Unido a sala meseros');
    }
  }

  onNuevoPedido(callback) {
    if (this.socket) {
      this.socket.on('nuevo_pedido', callback);
    }
  }

  onPedidoActualizado(callback) {
    if (this.socket) {
      this.socket.on('pedido_actualizado', callback);
    }
  }

  onPedidoListo(callback) {
    if (this.socket) {
      this.socket.on('pedido_listo', callback);
    }
  }

  offNuevoPedido() {
    if (this.socket) {
      this.socket.off('nuevo_pedido');
    }
  }

  offPedidoActualizado() {
    if (this.socket) {
      this.socket.off('pedido_actualizado');
    }
  }

  offPedidoListo() {
    if (this.socket) {
      this.socket.off('pedido_listo');
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;
