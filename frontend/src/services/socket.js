import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Conectado:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Desconectado');
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Error de conexión:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
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
