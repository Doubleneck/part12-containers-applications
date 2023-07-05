FROM node:16 

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV BACKEND_URI=http://puhelinluettelo-back-prod:3001/api/persons/

RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build"]