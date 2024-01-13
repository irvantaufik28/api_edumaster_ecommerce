FROM node:20


WORKDIR .

COPY . .

RUN yarn install

CMD ["yarn", "run", "start"]