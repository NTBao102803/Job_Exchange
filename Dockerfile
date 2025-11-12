# Dockerfile (root repo) - ÉP Railway dùng Docker Compose
FROM docker:latest
RUN apk add --no-cache docker-compose
COPY . .
WORKDIR /BackEnd
CMD ["docker-compose", "up"]' > Dockerfile