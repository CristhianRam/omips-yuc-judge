FROM node:20-alpine

WORKDIR /worker

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
