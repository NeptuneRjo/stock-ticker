FROM node:21-alpine

RUN npm install -g nodemon

WORKDIR /scraper

COPY package.json .

RUN npm install

ENV PGPASSWORD=password
ENV PGDATABASE=admin
ENV PGHOST=database
ENV PGUSER=admin
ENV PGPORT=5432

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]