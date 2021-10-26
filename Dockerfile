FROM node:14.17.1
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .
#not needed
#RUN npm run build

EXPOSE 5000
CMD ["serve", "-s", "build"]