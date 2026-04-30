# NEXUSPLAY

>Daniel Dominguez, Mario Luna y David Martinez

## Guía de Instalación y Ejecución

### Requisitos Previos
- Node.js y npm instalados
- PHP y Composer instalados
- Servidor de base de datos local (**XAMPP**)

### Backend (Laravel)

1. **Instalar dependencias:**
   Abre una terminal, navega a la carpeta del backend y ejecuta el siguiente comando:
   ```bash
   cd backend
   composer install
   ```

2. **Configuración del entorno (`.env`):**
   - El archivo `.env` contiene las variables de configuración de tu entorno local (como la conexión a la base de datos). 
   - Copia el archivo de ejemplo proporcionado para crear tu configuración real:
     ```bash
     cp .env.example .env
     ```
   - Abre el nuevo archivo `.env` y asegúrate de usar la siguiente configuración para la base de datos de **XAMPP** (donde el usuario por defecto es `root` sin contraseña):
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=nexusplay
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Añade las siguientes variables al `.env` para que la integración con la API de IGDB funcione correctamente (credenciales compartidas):
     ```env
     IGDB_CLIENT_ID="yqrgkl6ezshd2mdhh8iixjgb9d7u8j"
     IGDB_CLIENT_SECRET="4bq2kfqmrdfdxbclbgxjp7oquyvwiu"
     ```
   - *Nota: Asegúrate de crear una base de datos llamada `nexusplay` en tu gestor de base de datos de XAMPP (phpMyAdmin) antes de continuar.*
   - Genera la clave única de la aplicación:
     ```bash
     php artisan key:generate
     ```
   - Enlaza el storage público para poder ver las imágenes de los usuarios:
     ```bash
     php artisan storage:link
     ```
   - Por último, ejecuta las migraciones para crear las tablas necesarias en la base de datos:
     ```bash
     php artisan migrate
     ```

3. **Lanzar el servidor Backend:**
   ```bash
   php artisan serve
   ```
   El backend se ejecutará y estará accesible en: `http://localhost:8000`

### Frontend (React)

1. **Instalar dependencias:**
   Abre otra terminal, navega a la carpeta del frontend y ejecuta:
   ```bash
   cd frontend
   npm install
   ```
   - El archivo `.env` contiene las variables de configuración de tu entorno local (como la conexión a la base de datos).

2. **Lanzar el servidor Frontend:**
   ```bash
   npm run dev
   ```
   Una vez iniciado, podrás acceder a la interfaz de la aplicación web abriendo en tu navegador la siguiente dirección: `http://localhost:5173` (el puerto puede variar, revisa lo que indique tu terminal).

### WordPress

1. **Configuración**
   La base de datos de WordPress **DEBE** ser la misma que la de Laravel.
   En frontend y backend, modifica el archivo `.env` en base al `.env.example`, añadiendo el enlace a wordpress **base**, en frontend la variable es `VITE_WP_URL` y en backend `WORDPRESS_URL`.

2. **Backup**
   En tu WordPress, descarga el plugin `UpdraftPlus`, lo activas y vas a la sección de backup (el panel de UpdraftPlus en el nav izquierdo de WordPress), arrastras los archivos .zip de la carpeta backup **sin descomprimirlos** y lo restauráis (no suele hacer falta modificar nada, con darle todo a siguiente es suficiente).