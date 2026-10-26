const { TIPOS, PREFERENCIAS } = require("../constants");

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function validarSolicitud(req, res, next) {
  const { modo, id_destino, tipo, personas, fecha_viaje, fecha_regreso, presupuesto, preferencias = [] } = req.body || {};
  const errores = [];

  if (!["destino", "presupuesto"].includes(modo)) errores.push("modo debe ser 'destino' o 'presupuesto'");
  if (modo === "destino" && !id_destino) errores.push("id_destino es obligatorio cuando el modo es 'destino'");
  if (tipo && !TIPOS.some((t) => t.id === tipo)) errores.push("tipo no válido");
  if (!Number.isInteger(personas) || personas < 1 || personas > 50) errores.push("personas debe ser un entero entre 1 y 50");
  if (!FECHA.test(fecha_viaje || "") || Number.isNaN(Date.parse(fecha_viaje))) errores.push("fecha_viaje debe tener formato AAAA-MM-DD");
  if (fecha_regreso != null && (!FECHA.test(fecha_regreso) || Number.isNaN(Date.parse(fecha_regreso)) || fecha_regreso < fecha_viaje)) {
    errores.push("fecha_regreso debe tener formato AAAA-MM-DD y no ser anterior a fecha_viaje");
  }
  if (!(Number(presupuesto) > 0)) errores.push("presupuesto debe ser mayor que 0");
  if (!Array.isArray(preferencias) || preferencias.some((p) => !PREFERENCIAS.some((x) => x.id === p))) {
    errores.push("preferencias contiene valores no válidos");
  }

  if (errores.length) return res.status(400).json({ errores });
  next();
}

module.exports = validarSolicitud;
