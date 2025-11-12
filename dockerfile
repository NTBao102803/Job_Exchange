# Dockerfile (root repo) - ÉP Railway dùng Docker Compose
FROM docker:latest

# Cài docker-compose
RUN apk add --no-cache docker-compose

# Copy toàn bộ repo
COPY . .

# Chạy docker-compose trong /BackEnd
WORKDIR /BackEnd
CMD ["docker-compose", "up"]