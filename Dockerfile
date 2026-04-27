FROM node:18-bullseye-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Bundle app source
COPY . .

# Create writable data volume for sqlite DB
VOLUME ["/app/data"]
ENV PORT=3000
EXPOSE 3000

# Run as non-root for security
RUN chown -R node:node /app
USER node

CMD ["node", "server.js"]
