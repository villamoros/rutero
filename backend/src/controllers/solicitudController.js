const { Solicitud, Paquete, Destino, Proveedor } = require("../models");
const { buscarOfertas } = require("../services/matchService");

function resumen(r) {
  const p = r.paquete;
  return {
    id: p.id,
    nombre: p.nombre,
    tipo: p.tipo,
    destino: p.destino && p.destino.nombre,
    proveedor: p.proveedor && p.proveedor.nombre,
    duracion_dias: p.duracion_dias,
    precio_persona: Number(p.precio),
    total: r.total,
    calificacion: Number(p.calificacion),
    etiquetas: p.etiquetas,
    regreso: r.regreso,
    puntaje: r.puntaje,
    razones: r.razones,
    alternativa: r.alternativa,
  };
}

async function createSolicitud(req, res, next) {
  try {
    const { modo, id_destino, tipo, personas, fecha_viaje, presupuesto, preferencias = [] } = req.body;
    const solicitud = await Solicitud.create({
      modo,
      id_destino: modo === "destino" ? id_destino : null,
      tipo: tipo || null,
      personas,
      fecha_viaje,
      presupuesto,
      preferencias,
    });

    const paquetes = await Paquete.findAll({
      where: { disponible: true },
      include: [
        { model: Destino, as: "destino" },
        { model: Proveedor, as: "proveedor", attributes: ["id", "nombre"] },
      ],
    });

    const { resultados, alternativas } = buscarOfertas(solicitud.get({ plain: true }), paquetes.map((p) => p.get({ plain: true })));

    res.status(201).json({
      solicitud,
      resultados: resultados.map(resumen),
      alternativas: alternativas.map(resumen),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSolicitud };
