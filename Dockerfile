# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for frontend (Quasar)
COPY package*.json ./

# Install Quasar CLI and frontend dependencies
RUN npm install -g @quasar/cli
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Expose port 9000 for Quasar frontend
EXPOSE 9000

# Command to start Quasar development server
CMD ["quasar", "dev"]
