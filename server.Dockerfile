FROM node:12-alpine AS builder

RUN npm install lerna -g

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./lerna.json ./lerna.json
COPY ./tsconfig.json ./tsconfig.json

COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
COPY ./server/library ./server/library

COPY ./common/package.json ./common/package.json
COPY ./common/tsconfig.json ./common/tsconfig.json
COPY ./common/src ./common/src/
COPY ./common/types ./common/src/

RUN lerna bootstrap

RUN cd common && yarn build
RUN cd ../server && yarn build

EXPOSE 3000
EXPOSE 80
EXPOSE 443

CMD cd ../server && yarn serve:prod