# Stage 1: Build Angular App
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build Angular app in production mode
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular files from Stage 1
COPY --from=build /app/dist/aiangularlab /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
