FROM node:16.2.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
