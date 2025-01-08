FROM node:alpine

RUN mkdir -p /usr/src/oktravel-nodejs-backend && chown -R node:node /usr/src/oktravel-nodejs-backend

WORKDIR /usr/src/oktravel-nodejs-backend

COPY package.json yarn.lock ./

USER node

RUN yarn install --production --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3006

CMD yarn start
