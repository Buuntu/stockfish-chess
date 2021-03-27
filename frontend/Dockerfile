FROM node:14

EXPOSE 8000 35729
WORKDIR /frontend
ENV NODE_PATH=/frontend/node_modules
ENV PATH=$PATH:/frontend/node_modules/.bin

COPY package.json /frontend
RUN npm install
WORKDIR /frontend/app

COPY ./ /frontend/app
