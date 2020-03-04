FROM openjdk:8-jdk-alpine
EXPOSE 9000
ARG JAR_FILE=target/customers-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]