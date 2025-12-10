# Etapa de build
FROM node:18 AS build
WORKDIR /app

# Copiamos todo el proyecto
COPY . .

# Instalamos dependencias del frontend incluyendo devDependencies (necesarias para Vite)
WORKDIR /app/frontend
RUN npm install

# Compilamos el frontend
RUN npm run build

# Etapa de producción
FROM node:18 AS production
WORKDIR /app/backend

# Copiamos solo lo necesario del backend
COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./


# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Exponemos el puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "start"]
