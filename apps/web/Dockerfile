FROM node:20.18.0-alpine
WORKDIR /commercialwebsite/

COPY package.json /commercialwebsite

COPY . .

RUN yarn && yarn build

FROM nginx:alpine

COPY --from=0 /commercialwebsite/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]