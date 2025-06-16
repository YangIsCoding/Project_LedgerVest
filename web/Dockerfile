FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY web/ ./web/

WORKDIR /app/web

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
