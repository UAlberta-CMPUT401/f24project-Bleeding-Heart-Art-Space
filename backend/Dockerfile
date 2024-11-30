FROM node:20
WORKDIR /usr/app/backend
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build
ENV DOTENV_CONFIG_PATH=/usr/app/backend/.env.production.local
CMD ["node", "-r", "dotenv/config", "dist/src/server.js"]
