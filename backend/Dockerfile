FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY . .

EXPOSE 5000

RUN npm install && npm install dotenv --save-dev

CMD [ "npm", "start" ]