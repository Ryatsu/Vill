# FROM node:22-alpine AS frontend-build
# WORKDIR /frontend
# COPY frontend/package*.json ./
# RUN npm install
# COPY frontend ./
# RUN npm run build

# FROM maven:3.9.9-eclipse-temurin-21 AS build
# WORKDIR /app/backend
# COPY backend/pom.xml ./
# COPY backend/mvnw ./
# COPY backend/mvnw.cmd ./
# COPY backend/src ./src
# COPY --from=frontend-build /frontend/dist ./src/main/resources/static
# RUN mvn clean package -DskipTests

# FROM eclipse-temurin:21-jdk-jammy
# WORKDIR /app
# COPY --from=build /app/backend/target/*.jar app.jar

# ENTRYPOINT ["java","-jar","app.jar"]