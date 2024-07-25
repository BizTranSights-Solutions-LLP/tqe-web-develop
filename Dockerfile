# Base image with Node.js 10
FROM node:14.15.5 as builder

# Set the working directory inside the container
WORKDIR /app

# Install Angular CLI globally compatible with Angular
RUN npm install -g @angular/cli@7.3.10
# RUN npm install --save-dev @angular/cli@7.3.10

# Copy package.json and package-lock.json (if available) into the container
COPY package.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of the project into the container
COPY . .

# Expose the port that ng serve uses
EXPOSE 4200

# Start the Angular app using the development server
CMD ["ng", "serve", "--host", "0.0.0.0"]
