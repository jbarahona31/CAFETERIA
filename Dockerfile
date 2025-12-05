# Etapa de build
FROM node:18 AS build
WORKDIR /app

# Copiamos todo el proyecto
COPY . .

# Instalamos dependencias del frontend incluyendo devDependencies (necesarias para Vite)
RUN npm install --prefix frontend --include=dev

# Compilamos el frontend
RUN npm run build --prefix frontend

# Etapa de producción
FROM node:18 AS production
WORKDIR /app

# Copiamos solo lo necesario del backend
COPY backend/package*.json ./backend/
RUN npm install --prefix backend --omit=dev

COPY backend ./backend

# Copiamos el frontend ya compilado
COPY --from=build /app/frontend/dist ./backend/dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Exponemos el puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "start", "--prefix", "backend"]
