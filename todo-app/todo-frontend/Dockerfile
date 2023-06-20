FROM node:16

WORKDIR /usr/src/todo_frontend

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

ENV REACT_APP_BACKEND_URL=http://localhost:3000
RUN npm run build
RUN npm install -g serve

# npm start is the command to start the application in development mode
CMD ["serve","-s", "build"]