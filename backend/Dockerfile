FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY . .

EXPOSE 5000

RUN npm install && npm install dotenv --save-dev

CMD [ "npm", "start" ]

HEALTHCHECK --timeout=10s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000 || exit 1