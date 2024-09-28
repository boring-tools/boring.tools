FROM nginx:alpine AS runtime
COPY ./ci/docker/website/nginx.conf /etc/nginx/nginx.conf
COPY ./build/website /usr/share/nginx/html
EXPOSE 80