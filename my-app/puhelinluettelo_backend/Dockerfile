FROM node:16
  
WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci --only=production

ENV DEBUG=playground:*
#change this for the real production database
ENV MONGODB_URI=mongodb://the_username:the_password@mongo_db_prod:27017/the_database 


USER node
CMD npm start