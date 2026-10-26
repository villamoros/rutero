# Cómo correr Rutero en Windows

Guía paso a paso para levantar la base de datos, la API y la app en tu PC con Windows (PowerShell).

## 0. Requisitos

En tu PC ya están instalados Node 24, npm 11, Git y PostgreSQL 17 (el servicio `postgresql-x64-17` está corriendo).
No hace falta instalar nada global: Expo se usa con `npx`.

Para ver la app en el celular instala **Expo Go** desde Play Store o App Store. El celular y el PC deben estar en la misma red Wi-Fi.

Vas a usar **dos terminales** de PowerShell: una para la API y otra para la app.

## 1. Base de datos

Tienes dos opciones.

**Opción A, la más rápida (SQLite):** no hagas nada. Si `backend/.env` no existe o `DB_HOST` está vacío, la API crea un archivo `rutero.sqlite` con datos ficticios. Salta al paso 2.

**Opción B, PostgreSQL (como en el Notion):**

1. Crea la base de datos (te pedirá la contraseña del usuario `postgres` que definiste al instalar PostgreSQL):

   ```powershell
   psql -U postgres -c "CREATE DATABASE rutero;"
   ```

2. Crea el archivo de configuración de la API:

   ```powershell
   cd "C:\Users\Juan Villamoros\Desktop\Rutero\rutero-mvp\backend"
   Copy-Item .env.example .env
   notepad .env
   ```

3. En el bloc de notas deja así las variables y guarda:

   ```
   PORT=4000
   DB_HOST=localhost
   DB_NAME=rutero
   DB_USER=postgres
   DB_PASS=tu_contraseña_de_postgres
   ```

Las tablas se crean solas la primera vez que arranca la API, y si la base está vacía se cargan los datos ficticios.

## 2. API (terminal 1)

```powershell
cd "C:\Users\Juan Villamoros\Desktop\Rutero\rutero-mvp\backend"
npm install
npm run dev
```

Debes ver `✅ Base de datos conectada` y `🚀 API de Rutero en http://localhost:4000`.

Para comprobarlo, abre en el navegador http://localhost:4000/api/opciones. Debe salir un JSON con destinos, tipos de plan y preferencias.

Si quieres reiniciar los datos semilla en cualquier momento (borra y vuelve a cargar todo): `npm run seed`.

Deja esta terminal abierta.

## 3. App (terminal 2)

```powershell
cd "C:\Users\Juan Villamoros\Desktop\Rutero\rutero-mvp\mobile"
npm install
Copy-Item .env.example .env
npx expo start
```

Cuando aparezca el código QR:

**Para verla en el navegador:** presiona `w`. Se abre en http://localhost:8081. Con `EXPO_PUBLIC_API_URL=http://localhost:4000` (el valor por defecto) funciona tal cual.

**Para verla en el celular con Expo Go:**

1. El celular no entiende `localhost`, así que la app tiene que apuntar a la IP de tu PC. Hoy tu IP en la red es `192.168.0.2` (puede cambiar; la ves con `ipconfig`, en "Dirección IPv4").
2. Abre `mobile\.env` con `notepad .env` y cambia la línea a:

   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.2:4000
   ```

3. Detén Expo con `Ctrl + C` y vuelve a iniciarlo limpiando la caché para que tome el cambio:

   ```powershell
   npx expo start -c
   ```

4. En Android abre Expo Go y escanea el QR. En iPhone escanéalo con la cámara.

## 4. Recorrido para probar

1. En el inicio elige **Tengo un destino** o **Tengo un presupuesto**.
2. Llena el formulario: destino, tipo de plan, personas, fecha, preferencias y presupuesto.
3. Revisa los resultados con su puntaje y razones.
4. Abre un paquete y solicita la reserva; queda en estado `pendiente`.

## 5. Problemas comunes

- **La app en el celular dice "No pudimos conectar con Rutero"**: revisa que `EXPO_PUBLIC_API_URL` tenga la IP del PC (no `localhost`), que reiniciaste con `npx expo start -c` y que el celular está en el mismo Wi-Fi. Si Windows mostró una alerta del Firewall para Node.js, permite el acceso en **redes privadas**. Prueba abrir `http://192.168.0.2:4000/api/opciones` en el navegador del celular.
- **El QR no conecta o tarda mucho**: usa `npx expo start --tunnel` (la primera vez puede pedir instalar `@expo/ngrok`).
- **Expo Go dice que el proyecto usa otra versión del SDK**: actualiza Expo Go desde la tienda. El proyecto usa Expo SDK 58.
- **`password authentication failed for user "postgres"`**: la contraseña en `backend\.env` no coincide con la de tu PostgreSQL.
- **`database "rutero" does not exist`**: falta el paso 1 de la opción B.
- **Puerto 4000 ocupado**: cambia `PORT` en `backend\.env` y la URL en `mobile\.env`.
- **`npm test` falla en PowerShell**: el script usa la sintaxis `NODE_ENV=test` de Linux/Mac. En Windows corre las pruebas así:

  ```powershell
  $env:NODE_ENV="test"; npx jest --runInBand
  ```

  Ojo: si `backend\.env` tiene `DB_HOST` lleno, las pruebas corren contra tu PostgreSQL en vez de SQLite en memoria. Para pruebas aisladas, deja `DB_HOST` vacío mientras las corres.

## 6. Git

El repositorio local ya está inicializado en la rama `main` con el commit inicial. `node_modules`, los `.env` y la base SQLite están en `.gitignore`, así que no se suben. Aún no hay remoto configurado (no se ha hecho push a GitHub).
