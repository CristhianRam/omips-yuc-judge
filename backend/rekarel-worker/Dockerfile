FROM node:20

WORKDIR /worker

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npx", "ts-node", "src/index.ts"]
