FROM node:21-alpine

WORKDIR /websocket

COPY package*.json .

RUN npm install

COPY . .

ENV PGPASSWORD=password
ENV PGDATABASE=admin
ENV PGHOST=database
ENV PGUSER=admin
ENV PGPORT=5432

EXPOSE 8000

CMD [ "npm", "run", "dev" ]