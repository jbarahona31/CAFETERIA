FROM node:18

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm install --omit=dev --prefix backend
COPY backend ./backend/

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]
CMD ["npm", "start", "--prefix", "backend"]
