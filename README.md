# Hurtig demo for Kamstrup DevOps Engineer rolle
## Byg image fra Dockerfile og push til image 
### Lokal
- Byg image med `docker build -t app:latest .`

### Remote Image Registry - Dockerhub
- Byg image med `docker build -t kevork/app:1.0 .`
- Push image `docker push kevork/app:1.0`

### Start med docker-compose
- `docker-compose up` eller detached med `docker-compose up -d`