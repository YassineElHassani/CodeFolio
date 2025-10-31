# --- Stage 1: The "Builder" ---
# This stage installs all dependencies (including dev) and builds the TypeScript.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy all remaining source code
COPY . .

# Run the TypeScript build script defined in package.json
RUN npm run build

# --- Stage 2: The "Production" Image ---
# This stage starts fresh and copies *only* the necessary files for production.
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install *only* production dependencies
RUN npm install --production

# Copy the compiled code (the 'dist' folder) from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app will run on
EXPOSE 4000

# The command to start the application
CMD [ "npm", "start" ]
