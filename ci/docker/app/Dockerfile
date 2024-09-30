FROM nginx:alpine AS runtime
COPY ./ci/docker/app/nginx.conf /etc/nginx/nginx.conf
COPY ./build/app /usr/share/nginx/html
EXPOSE 80