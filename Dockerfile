FROM node:7.7.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app


CMD [ "npm", "start" ]
