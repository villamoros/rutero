# Rutero (MVP)

App móvil para encontrar pasadías, tours y paquetes completos en el Pacífico colombiano.
La persona llena un formulario corto y la API le devuelve las ofertas que encajan con su destino,
fecha, número de personas, presupuesto y gustos, ordenadas por qué tanto le sirven.

```
rutero/
├── backend/   API en Node + Express + Sequelize (estructura del Notion)
└── mobile/    App en React Native con Expo y Expo Router
```

## Por qué React Native (Expo)

Juan trabaja a diario con JavaScript, y el backend que ya estaba diseñado en Notion es Node + Express,
así que con React Native todo el proyecto queda en un solo lenguaje. Flutter exigiría aprender Dart.
Expo permite probar en el teléfono con Expo Go y generar una versión web sin configurar Xcode ni Android Studio.

## Cómo correrlo

Requisitos: Node 20 o superior.

```bash
# 1. API (usa SQLite con datos ficticios si no configuras PostgreSQL)
cd backend
npm install
npm run seed     # borra y carga los datos semilla
npm run dev      # http://localhost:4000
npm test         # 13 pruebas del motor de coincidencias y de la API

# 2. App
cd ../mobile
npm install
cp .env.example .env   # ajusta EXPO_PUBLIC_API_URL si pruebas en un teléfono
npx expo start         # escanea el QR con Expo Go, o presiona w para web
```

Para usar PostgreSQL, copia `backend/.env.example` a `backend/.env` y llena `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASS`.

## Flujo de la app

1. Inicio con los dos caminos del wireframe: **Tengo un destino** y **Tengo un presupuesto**.
2. Formulario por pasos: destino, tipo de plan, personas, fecha, preferencias y presupuesto total.
3. Resultados con puntaje de afinidad y las razones (presupuesto, gustos que coinciden, calificación).
   Si nada encaja exacto, muestra alternativas en otras fechas o un poco por encima del presupuesto.
4. Detalle del paquete con los servicios incluidos y un formulario para solicitar la reserva (queda `pendiente`).

## API

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/opciones` | Destinos, tipos de plan y preferencias para el formulario |
| POST | `/api/solicitudes` | Guarda el formulario y devuelve `resultados` y `alternativas` |
| GET | `/api/paquetes/:id` | Paquete con destino, proveedor y servicios |
| POST | `/api/reservas` | Crea (o reutiliza) el cliente y una reserva pendiente |

## Base de datos

Sigue las tablas de la página "Tablas de Base de datos en PostgreSQL" del Notion de Rutero:
`proveedores`, `categorias_servicios`, `servicios`, `paquetes`, `paquete_servicios`, `clientes` y `reservas`,
con los mismos nombres de columnas. Del diagrama relacional se tomó la tabla `destinos`.

Cambios hechos para que el buscador funcione:

- `paquetes`: se añadieron `tipo` (pasadia, tour, paquete_completo), `id_destino`, `duracion_dias`,
  `cupo_min`, `cupo_max`, `fecha_inicio`, `fecha_fin` (temporada), `etiquetas`, `calificacion` y `disponible`.
  El `precio` se interpreta por persona, en pesos colombianos.
- `reservas`: se añadieron `fecha_viaje`, `personas` e `id_solicitud`.
- Tabla nueva `solicitudes`: guarda cada formulario enviado. Cumple el papel de `usuarios.preferencias`
  del diagrama, sin exigir registro en el MVP.

Quedan para la siguiente fase, tal como están en el Notion: `usuarios` con Clerk, `empleados`, `pagos`
y las rutas del panel de proveedores con multi-tenant.

Los datos semilla (`backend/src/seed/data.js`) son ficticios: 8 destinos, 6 proveedores, 24 servicios y 20 paquetes.

## Cómo se eligen las ofertas

`backend/src/services/matchService.js` es una función pura:

- **Filtros**: destino (si se eligió), tipo de plan, cupo, disponibilidad, que el viaje completo
  quepa en la temporada del paquete y que el total no pase el presupuesto en más de 15%.
- **Puntaje (0 a 100)**: 40 por aprovechar bien el presupuesto, 40 por coincidir con las preferencias
  y 20 por calificación.

Es determinista para poder probarlo y explicarlo. La "IA" del wireframe puede entrar después
reemplazando el cálculo del puntaje sin cambiar la API.
