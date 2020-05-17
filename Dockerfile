FROM arm64v8/node:current-slim

WORKDIR /usr/src/app
COPY package.json .
RUN npm install

EXPOSE 8080
CMD [ "npm", "run" ,"build"]

COPY . .
