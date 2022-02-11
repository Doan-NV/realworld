# Image source
FROM node:16
# Docker working directory
WORKDIR /src
# Copying file into APP directory of docker
COPY ./package.json ./package-lock.json /src/

# Then install the NPM module
RUN npm install
# Copy current directory to APP folder
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]