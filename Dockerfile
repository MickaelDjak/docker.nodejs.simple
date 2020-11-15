FROM node:14.15.0-alpine3.10

EXPOSE 3000
ENV MONGO_DB_USERNAME=admin
ENV MONGO_DB_PASSWORD=rootpass
RUN apk add --no-cache tini
RUN mkdir -p /home/app
WORKDIR /home/app
COPY ./package.json ./package-lock.json* ./
RUN npm install
COPY ./src ./

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./app.js"]