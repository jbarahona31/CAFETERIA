FROM node:18

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]
