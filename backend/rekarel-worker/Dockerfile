FROM node:20-alpine

WORKDIR /worker

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Run as non-root user
RUN addgroup --system --gid 1001 workergroup
RUN adduser --system --uid 1001 workeruser
USER workeruser

CMD ["node", "dist/index.js"]
