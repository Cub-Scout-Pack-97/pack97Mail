FROM mhart/alpine-node:latest
## Use Alpine as the OS because of it's size

MAINTAINER John Kelley johnkelley4477@gmail.com

## Update package definitions
RUN apk upgrade --update

## Install GIT
RUN apk add git

## Move to dev folder
RUN git clone https://github.com/johnkelley4477/pack97Mail.git

## Create Working Dir
WORKDIR /Pack97Mail

## Checkout develop branch
RUN git checkout develop

## Delete GIT
## RUN apk del git

## Install dependances
RUN npm install

## Install Nodemon (dev) 
RUN npm install -g nodemon

EXPOSE 587

CMD [ "nodemon", "server.js" ]