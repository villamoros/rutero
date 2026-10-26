const express = require("express");
const { getOpciones } = require("../controllers/catalogoController");
const { getPackage } = require("../controllers/paqueteController");
const { createSolicitud } = require("../controllers/solicitudController");
const { createReserva } = require("../controllers/reservaController");
const validarSolicitud = require("../middlewares/validarSolicitud");

const router = express.Router();

// Rutas públicas de la app móvil. Las del panel de proveedores (multi-tenant con Clerk)
// llegan en la siguiente fase, siguiendo la estructura del Notion.
router.get("/opciones", getOpciones);
router.post("/solicitudes", validarSolicitud, createSolicitud);
router.get("/paquetes/:id", getPackage);
router.post("/reservas", createReserva);

module.exports = router;
