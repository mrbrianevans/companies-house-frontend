FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

CMD [ "npm", "start" ]
