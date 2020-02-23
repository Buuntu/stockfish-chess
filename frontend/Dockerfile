FROM node:latest

WORKDIR /app

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install
RUN npm install react-scripts

EXPOSE 35729

CMD ["npm", "start"]
