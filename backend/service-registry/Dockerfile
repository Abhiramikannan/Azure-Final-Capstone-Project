FROM openjdk:17
ADD target/service-registry.jar .
EXPOSE 8761
ENTRYPOINT ["java","-jar","service-registry.jar"]