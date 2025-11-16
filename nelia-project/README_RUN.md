# NELIA Minimal Demo - Run Instructions (Windows 11)

Pre-requisitos:
- Docker Desktop instalado.

Passos:
1. cd nelia-project
2. docker-compose up --build
3. Testar:
   $body = @{ question = "NEL" } | ConvertTo-Json
   curl -Method POST -Uri "http://localhost:8000/query" -ContentType "application/json" -Body $body
