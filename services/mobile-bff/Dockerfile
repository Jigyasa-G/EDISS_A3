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
EXPOSE 80

# Set environment variables with defaults
# These can be overridden at runtime with -e flags
ENV DB_HOST=host.docker.internal \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=bookstore \
    PORT=80 \
    URL_BASE_BACKEND_SERVICES=http://host.docker.internal:3000

# Set the entrypoint to run in development mode with nodemon
# ENTRYPOINT ["npm", "run", "dev"]

# Default command
CMD ["node", "index.js"]