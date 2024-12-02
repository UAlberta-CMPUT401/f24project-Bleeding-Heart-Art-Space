FROM node:20 as frontend-build
WORKDIR /usr/app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
FROM node:20
WORKDIR /usr/app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
RUN npm run build
COPY --from=frontend-build /usr/app/frontend/dist ./dist/src/dist/
ENV NODE_ENV=production
ENV DOTENV_CONFIG_PATH=/usr/app/backend/.env.production.local
CMD ["node", "-r", "dotenv/config", "dist/src/server.js"]
