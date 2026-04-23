# @file backend/rekarel-worker/Dockerfile
# @description Definicion de imagen Docker del servicio correspondiente.
# @symbols N/A

FROM node:20-alpine

WORKDIR /worker

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Run as non-root user
RUN addgroup --system --gid 1001 workergroup
RUN adduser --system --uid 1001 workeruser
RUN mkdir -p /data/problems && chown workeruser:workergroup /data/problems
USER workeruser

CMD ["node", "dist/index.js"]
