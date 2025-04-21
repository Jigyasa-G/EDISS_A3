# Dockerfile for CRM Service
# Use Node.js LTS as base image
FROM node:18-alpine

# Install MySQL client for connectivity testing
RUN apk add --no-cache mysql-client

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install both production and development dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables with defaults
# These can be overridden at runtime with -e flags
ENV DB_HOST=host.docker.internal \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=bookstore \
    PORT=3000 \
    SMTP_HOST=smtp.gmail.com \
    SMTP_USER=jigyasatata2@gmail.com \
    SMTP_PASS="cxnk gzyy xqvo rhrd" \
    ANDREW_ID=jigyasag \
    TOPIC=jigyasag.customer.evt \
    KAFKA_BOOTSTRAP=3.129.102.184:9092,18.118.230.221:9093,3.130.6.49:9094

# Set the entrypoint to run in development mode with nodemon
# ENTRYPOINT ["npm", "run", "dev"]
# , "node", "index.js"

CMD ["node", "index.js"]

