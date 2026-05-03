# # ---------- frontend build ----------
# FROM node:22-alpine AS frontend-build
# WORKDIR /frontend

# COPY frontend/package*.json ./
# RUN npm ci

# COPY frontend/ .
# RUN npm run build


FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY backend/src/main/resources/.env /app/.env

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]