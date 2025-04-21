#!/bin/bash
# Update these values:
KEY_PATH=../labsuser.pem
SCHEMA_FILE=./bookstore-schema.sql
USERNAME=ec2-user
INSTANCES=(
  "ec2-18-214-84-195.compute-1.amazonaws.com"
  "ec2-13-216-42-115.compute-1.amazonaws.com"
  "ec2-34-192-253-161.compute-1.amazonaws.com"
  "ec2-13-219-48-159.compute-1.amazonaws.com"
)
IMAGES=(
  "jigyasag/book-service"
  "jigyasag/customer-service"
  "jigyasag/mobile-bff"
  "jigyasag/web-bff"
)
for HOST in "${INSTANCES[@]}"; do
  echo "------ Connecting to $HOST ------"
  ssh -i "$KEY_PATH" "$USERNAME@$HOST" <<EOF
    echo "Pulling Docker images....."
    $(for img in "${IMAGES[@]}"; do echo "docker pull $img:latest"; done)
    echo "Stopping all containers....."
    docker ps -q | xargs -r docker stop
    echo "Removing old containers......"
    docker container prune -f
    echo "Starting containers (docker-compose)..."
    docker-compose up -d
    echo "Running schema script....."
    mysql -h bookstore-db-dev.cluster-cdcmvzkmrbdr.us-east-1.rds.amazonaws.com -u root -pedispass < bookstore-schema.sql
EOF
  echo "Done with $HOST"
done