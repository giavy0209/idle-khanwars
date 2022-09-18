FROM node:14-alpine 
# as BUILD_IMAGE
# Create app directory
# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app
# Install any needed packages 
RUN npm install -f

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]