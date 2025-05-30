FROM node:22 as build
WORKDIR /app
COPY . .
COPY conf/.env.production /app/.env
RUN npm install
RUN npm run build

FROM nginx:stable-alpine-slim
WORKDIR /
COPY --from=build /app/dist /usr/share/nginx/html
COPY conf/nginx /etc/nginx/conf.d/default.conf
