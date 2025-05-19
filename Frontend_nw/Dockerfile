FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Use ARG to accept the API URL during build
ARG VITE_API_URL

# Set the environment variable for the build process - use /api as the URL
ENV VITE_API_URL='/api'

# Build the application
RUN npm run build

# Use an official Nginx image to serve the built files
FROM nginx:alpine

# Copy the built files to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]