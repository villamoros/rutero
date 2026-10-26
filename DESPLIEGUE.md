# Desplegar Rutero en Vercel

Se crean **dos proyectos de Vercel** a partir del mismo repositorio de GitHub (`villamoros/rutero`):

| Proyecto | Carpeta raíz | Qué es |
|---|---|---|
| `rutero-api` | `backend` | La API de Express, como función de Vercel |
| `rutero-web` | `mobile` | La versión web de la app de Expo, como sitio estático |

La base de datos es PostgreSQL gratis en **Neon**, conectada desde el panel de Vercel. Ninguna credencial va en el repositorio: Vercel las guarda como variables de entorno.

## 1. Subir el código

```powershell
cd "C:\Users\Juan Villamoros\Desktop\Rutero\rutero-mvp"
git remote add origin https://github.com/villamoros/rutero.git
git push -u origin main
```

Después de esto, cada `git push` a `main` vuelve a desplegar los dos proyectos solo.

## 2. Proyecto de la API

1. En https://vercel.com/new importa el repositorio `villamoros/rutero`.
2. Nombre del proyecto: `rutero-api`.
3. En **Root Directory** elige `backend`. Vercel debe detectar el preset **Express**.
4. Dale **Deploy**. Este primer despliegue todavía no tiene base de datos; es normal.
5. Entra al proyecto, pestaña **Storage** → **Create Database** → **Neon** (plan gratis). Ponle de nombre `rutero-db`, elige una región cercana (por ejemplo `us-east-1`) y conéctala al proyecto `rutero-api` en todos los entornos. Esto crea la variable `DATABASE_URL`.
6. Pestaña **Deployments** → en el último despliegue, menú `⋯` → **Redeploy**, para que tome la variable.
7. Prueba abriendo `https://<dominio-de-rutero-api>/api/opciones`. La primera vez tarda unos segundos porque crea las tablas y carga los datos de prueba. Debe salir un JSON con 8 destinos.

Copia ese dominio (por ejemplo `https://rutero-api.vercel.app`), lo necesitas en el paso siguiente.

## 3. Proyecto de la web

1. En https://vercel.com/new importa otra vez `villamoros/rutero`.
2. Nombre del proyecto: `rutero-web`.
3. En **Root Directory** elige `mobile`. El resto de la configuración ya viene en `mobile/vercel.json` (compila con `expo export` y publica la carpeta `dist`).
4. En **Environment Variables** agrega:
   - `EXPO_PUBLIC_API_URL` = el dominio de la API, sin `/` al final (por ejemplo `https://rutero-api.vercel.app`).
5. Dale **Deploy** y abre el dominio de `rutero-web`.

Si cambias `EXPO_PUBLIC_API_URL` después, hay que volver a desplegar `rutero-web`, porque el valor queda dentro del código compilado.

## Problemas comunes

- **La web dice "No pudimos conectar con Rutero"**: revisa que `EXPO_PUBLIC_API_URL` apunte al dominio de la API y que `https://<api>/api/opciones` responda.
- **La API responde error 500 en `/api/...`**: en `rutero-api` → **Logs**, busca el error. Lo más común es que falte `DATABASE_URL` o no se haya hecho el Redeploy.
- **Quiero empezar con la base limpia**: en Neon borra las tablas (o la rama) y la próxima petición las vuelve a crear con los datos de prueba.

## Cómo funciona por dentro

- `backend/src/config/database.js` usa `DATABASE_URL` (o `POSTGRES_URL`) si existe, con SSL. Si no, usa el PostgreSQL local de `DB_HOST` o SQLite.
- `backend/src/config/iniciarBase.js` crea las tablas, agrega columnas nuevas y carga los datos de prueba si la base está vacía. En Vercel corre con la primera petición a `/api`; en local, al arrancar `npm run dev`.
