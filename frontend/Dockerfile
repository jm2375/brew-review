# Build
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
ENV PORT=9000
EXPOSE 9000
CMD ["sh", "-c", "serve -s dist -l $PORT"]
