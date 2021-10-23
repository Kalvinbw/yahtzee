FROM node:14.17.1
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm build

EXPOSE 8080
USER node
CMD [ "serve", "-s", "build" ]