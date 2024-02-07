FROM node:21-alpine

RUN npm install -g typescript tsc-watch

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]