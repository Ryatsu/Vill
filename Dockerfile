## Build the frontend
FROM node:22-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

## Build the backend and embed the frontend build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace/backend
# Copy only backend sources needed for Maven build
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/mvnw.cmd ./
COPY backend/src ./src
# Copy frontend build into Spring Boot static resources
COPY --from=frontend-build /workspace/frontend/dist ./src/main/resources/static
# Package the application
RUN mvn -f pom.xml clean package -DskipTests --batch-mode

## Runtime image
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /workspace/backend/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]