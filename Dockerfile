# Stage 1: Build the React Client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Server
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy server code
COPY server/ ./

# Copy built client static files to server's public directory (to be served)
# NOTE: We need to ensure the server is configured to serve these static files.
# Currently server only serves /media. We likely need to update server.js to serve the app too.
# But for now, let's just copy them to a 'client_dist' folder
COPY --from=client-build /app/client/dist ./client_dist

# Create directory for music mount
RUN mkdir -p public/music

# Expose port
EXPOSE 3001

# Start command
CMD ["node", "server.js"]
