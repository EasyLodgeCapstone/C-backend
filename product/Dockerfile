# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
# RUN npm run build

# DEBUG: Check what was built
# RUN ls -la /usr/src/app/dist/ || echo "dist folder not found!"

# Expose the application port
EXPOSE 3001

# Command to run the application
# CMD ["node", "dist/src/main.js"]
CMD ["npm", "run", "start:dev"]