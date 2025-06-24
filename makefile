# Makefile para simplificar tareas comunes

# Variables (ajusta si es necesario)

NODE=node
NPM=npm
SERVE=npx serve
MYSQL=mysql

.PHONY: help install start frontend db-init test

help:
@echo "Uso: make <target>"
@echo "Targets disponibles:"
@echo "  install    Instala dependencias del backend"
@echo "  start      Inicia el servidor Express (backend)"
@echo "  frontend   Sirve el frontend estático"
@echo "  db-init    Inicializa la base de datos vía servidor/schema.sql"
@echo "  test       Ejecuta tests del backend"
@echo "  help       Muestra esta ayuda"

install:
@echo ">> Instalando dependencias del backend..."
cd server && \$(NPM) install

start:
@echo ">> Iniciando servidor en puerto \$(PORT:=3000)..."
cd server && \$(NODE) index.js

frontend:
@echo ">> Sirviendo frontend en el directorio actual..."
\$(SERVE) .

db-init:
@if \[ -f server/schema.sql ]; then&#x20;
echo ">> Importando esquema a la base de datos...";&#x20;
\$(MYSQL) -u ${DB_USER:-root} -p${DB\_PASS:-} -h ${DB_HOST:-localhost} ${DB\_NAME:-barberia} < server/schema.sql;&#x20;
else&#x20;
echo "ERROR: server/schema.sql no encontrado"; exit 1;&#x20;
fi

test:
@echo ">> Ejecutando tests de backend..."
cd server && \$(NPM) test

Access-Control-Allow-Origin: *