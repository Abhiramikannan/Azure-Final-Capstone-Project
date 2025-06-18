# Step 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the app with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Remove default nginx config and copy custom one
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
