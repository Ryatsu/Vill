# ---------- frontend build ----------
FROM node:22-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build


# ---------- backend build ----------
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/src ./src

# copy frontend build into Spring static folder
COPY --from=frontend-build /frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# ---------- runtime ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=backend-build /backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]