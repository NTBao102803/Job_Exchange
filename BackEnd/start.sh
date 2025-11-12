#!/bin/bash
set -e

echo "🚀 Starting Docker Compose on Railway..."
docker compose --env-file ./global.env up --build
