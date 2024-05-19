FROM node:20.12

WORKDIR /app

COPY package*.json ./

RUN npm install --loglevel verbose

RUN apt-get update && \
    apt-get install -y awscli

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
