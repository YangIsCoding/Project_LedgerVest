FROM node:18-alpine

WORKDIR /app

# Copy root-level package files (shared across project)
COPY package.json package-lock.json ./
RUN npm install

# Copy only the web app code
COPY web/ ./web/

# Set working dir to web app
WORKDIR /app/web

# Prisma and build
RUN npx prisma generate
RUN npm run seed:admins
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
