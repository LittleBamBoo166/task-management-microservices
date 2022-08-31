FROM node:14.8.0-alpine
RUN npm install -g npm@8.14.0
RUN mkdir -p var/www/user
WORKDIR /var/www/user
RUN npm install
CMD npm run build && npm run start:prod