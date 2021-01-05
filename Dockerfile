FROM arm64v8/node:current-buster-slim

WORKDIR /usr/src/app
COPY package.json .
COPY movies.json .
RUN npm config set unsafe-perm true
RUN npm install

EXPOSE 8080
CMD [ "npm", "run" ,"build"]

COPY . .
