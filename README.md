# Agenda Barbería

Este proyecto es una **agenda online para barberías** con gestión de múltiples peluqueros y sus citas, utilizando un **backend en Node.js/Express** y **MySQL** como base de datos, y un **frontend con Bootstrap, jQuery, jQuery UI y FullCalendar Scheduler**.

---

## 🔧 Requisitos previos

Antes de comenzar, asegúrate de tener instalado en tu equipo:

* **Node.js** (v16 o superior) y **npm**
* **MySQL** (v8 o superior)
* (Opcional) **Live Server** o extensión similar para servir el frontend

---

## 📂 Estructura del proyecto

```
barberiaMalcorra/
├── server/                # Backend (Express + MySQL)
│   ├── db.js              # Configuración del pool de conexiones
│   ├── index.js           # Punto de entrada del servidor
│   ├── routes/
│   │   ├── barberos.js    # CRUD de peluqueros
│   │   └── citas.js       # CRUD de citas y endpoint para FullCalendar
│   ├── test-connection.js # Script para probar conexión a BD
│   └── package.json       # Dependencias y scripts npm
├── css/
│   └── styles.css         # Estilos personalizados
├── img/
│   ├── logo.png           # Logo de la barbería
│   └── user-icon.png      # Icono de usuario para navbar
├── js/
│   └── app.js             # Lógica frontend (fetch API, calendarios)
├── index.html             # Página principal
└── README.md              # Este archivo
```

---

## 🛠️ Configuración de la base de datos

1. **Arrancar MySQL** en tu máquina:

   ```bash
   # Linux (Debian/Ubuntu)
   sudo systemctl start mysql

   # macOS (Homebrew)
   brew services start mysql

   # Windows: abre MySQL Workbench o el servicio desde Servicios
   ```

2. **Entrar al cliente MySQL** con tu usuario administrador:

   ```bash
   mysql -u root -p
   ```

3. **Crear la base y el usuario** (opcional):

   ```sql
   CREATE DATABASE barberia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'barberuser'@'localhost' IDENTIFIED BY 'TuPassFuerte';
   GRANT ALL PRIVILEGES ON barberia.* TO 'barberuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Configurar variables de entorno**:

   * Copia el archivo de ejemplo:

     ```bash
     cd server
     cp .env.example .env  # si existe .env.example
     ```
   * O crea `server/.env` con estas líneas:

     ```env
     DB_HOST=localhost
     DB_USER=barberuser  # o root si no creaste uno nuevo
     DB_PASS=TuPassFuerte
     DB_NAME=barberia
     PORT=3000
     ```

5. **Crear tablas** (desde el cliente MySQL o ejecutando un script de migración):

   ```bash
   mysql -u barberuser -p barberia < server/schema.sql
   ```

   Donde `server/schema.sql` contiene:

   ```sql
   CREATE TABLE barberos (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nombre VARCHAR(100) NOT NULL,
     especialidad VARCHAR(100)
   );
   CREATE TABLE citas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     barbero_id INT NOT NULL,
     cliente_nombre VARCHAR(100) NOT NULL,
     cliente_telefono VARCHAR(20),
     fecha DATETIME NOT NULL,
     duracion_min INT NOT NULL DEFAULT 30,
     FOREIGN KEY (barbero_id) REFERENCES barberos(id)
   );
   ```

---

## 🚀 Levantar la aplicación

1. **Instalar dependencias y arrancar el servidor**:

   ```bash
   cd server
   npm install
   node index.js
   # Deberías ver: "API escuchando en puerto 3000"
   ```

2. **Servir el frontend**:

   * Con Live Server (VSCode), abre la carpeta raíz y presiona "Go Live" en `index.html`, normalmente en [http://127.0.0.1:5500](http://127.0.0.1:5500)
   * O con un servidor estático rápido:

     ```bash
     npx serve .
     ```

3. **Abrir en el navegador**:

   * Frontend: [http://127.0.0.1:5500](http://127.0.0.1:5500) (o la URL que indique tu Live Server)
   * Backend: [http://127.0.0.1:3000/api/barberos](http://127.0.0.1:3000/api/barberos) para comprobar

---

## 📋 Uso

1. **Panel Admin**:

   * Pulsa **Administrar** y autentica (JWT/session según configuración futura).
   * Crea/edita/elimina peluqueros.

2. **Nueva reserva**:

   * Selecciona fecha, hora y peluquero.
   * Rellena datos de cliente y confirma.
   * Se mostrará la cita en el modal y se guardará en la BD.

3. **Agenda por peluquero (FullCalendar)**:

   * Verás la vista **Resource Timeline** con cada barbero.
   * Eventos clicables e indicadores de hora actual.
   * Al crear/editar/cancelar, el calendario se actualizará automáticamente.

---

## 🧪 Tests

* En el directorio `server/`, ejecuta:

  ```bash
  npm test
  ```

  Incluye pruebas con **Jest** y **Supertest** para endpoints CRUD y validación de solapamiento.

---

## 📦 Despliegue

* **Docker**: incluye `Dockerfile` en `server/`.
* **Variables de entorno**: configurar en tu plataforma (Heroku, AWS, Vercel, DigitalOcean).
* **Base de datos remota**: si no quieres local, usa RDS, PlanetScale u otro.

---

¡Listo! Con estos pasos, tus compañeros podrán clonar el repositorio, configurar la BD y levantar la app sin inconvenientes. Cualquier duda, avísame.
