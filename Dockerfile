FROM node:12.19.0-alpine3.9 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install yarn

RUN yarn 

COPY . .

CMD ["yarn", "start:dev"]