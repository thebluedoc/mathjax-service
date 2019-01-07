FROM node:latest
WORKDIR /app

COPY package.json yarn.lock ./app/
RUN yarn

ADD . /app

CMD ["yarn start"]
