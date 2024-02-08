FROM postgres:16.1-alpine

WORKDIR /database

ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=testdb

COPY . .

EXPOSE 5432