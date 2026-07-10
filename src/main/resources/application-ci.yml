# src/main/resources/application-ci.yml
#
# Purpose: let the app start up in CI with zero external dependencies,
# just long enough to serve /v3/api-docs. Customize the datasource /
# disabled beans to match what your actual project needs to boot.

spring:
  datasource:
    url: jdbc:h2:mem:ci;DB_CLOSE_DELAY=-1
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    open-in-view: false

  # If your app calls out to other services (Kafka, Redis, external APIs,
  # feature-flag providers, etc.), either:
  #   1. Point them at a lightweight local stand-in (Testcontainers, embedded broker), or
  #   2. Wire a @Profile("ci") stub bean that no-ops instead of connecting.
  # springdoc only needs the Spring context to fully start — it doesn't
  # care whether those integrations are "real."

springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: false   # not needed in CI, one less thing to boot