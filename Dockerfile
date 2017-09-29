FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
ADD ./s_garden /usr/src/app
WORKDIR /usr/src/app
RUN npm install

EXPOSE 3111
CMD [ "npm", "run", "start-express-prod" ]