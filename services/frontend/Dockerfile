FROM node:17-alpine

WORKDIR /frontend_container

COPY package.json .

RUN npm install

COPY . .

ENV REACT_APP_WEBSOCKET_ENDPOINT=http://localhost:8000
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 3000

CMD [ "npm", "start" ]