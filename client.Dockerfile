## Build stage
FROM node:12-alpine AS builder

RUN npm install lerna -g

WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./lerna.json ./lerna.json
COPY ./tsconfig.json ./tsconfig.json

COPY ./client/package.json ./client/package.json
COPY ./client/tsconfig.json ./client/tsconfig.json
COPY ./client/angular.json ./client/angular.json
COPY ./client/src ./client/src
COPY ./client/nginx.conf ./client/nginx.conf

COPY ./common/package.json ./common/package.json
COPY ./common/tsconfig.json ./common/tsconfig.json
COPY ./common/src ./common/src/
COPY ./common/types ./common/src/

RUN lerna bootstrap

RUN cd ./common && yarn build
RUN cd ./client && yarn build

## Run stage
FROM nginx:1.17.1-alpine
COPY --from=builder /usr/src/app/client/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/client/dist/client /usr/share/nginx/html