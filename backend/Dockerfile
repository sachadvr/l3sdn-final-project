# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g nodemon

# Copy the rest of the backend code to the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the backend server
CMD ["nodemon", "server.js"]
