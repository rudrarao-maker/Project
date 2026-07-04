FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Create uploads directory
RUN mkdir -p uploads/documents

EXPOSE 5000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && node src/server.js"]
