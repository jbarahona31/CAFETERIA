# Imagen base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del backend
COPY backend/package*.json ./backend/
RUN npm install --omit=dev --prefix backend
COPY backend ./backend/

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Exponer el puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "start", "--prefix", "backend"]
