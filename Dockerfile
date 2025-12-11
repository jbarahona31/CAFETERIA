# Imagen base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /backend

# Copiar archivos de configuración del backend
COPY backend/package*.json ./

# Instalar dependencias sin devDependencies
RUN npm install --omit=dev

# Copiar el resto del backend
COPY backend ./

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=4000

# Exponer el puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "start"]
