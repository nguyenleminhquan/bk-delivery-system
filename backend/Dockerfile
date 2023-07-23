FROM node:18.12.1-alpine3.16
EXPOSE 5000

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]

HEALTHCHECK --timeout=10s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000 || exit 1