const { sequelize, Cliente, Reserva, Paquete } = require("../models");

// Crea una reserva en estado "pendiente". El pago y la confirmación del proveedor
// quedan para la siguiente fase (tabla pagos del Notion).
async function createReserva(req, res, next) {
  const { id_paquete, id_solicitud, nombre, email, telefono, personas, fecha_viaje, fecha_regreso } = req.body || {};
  if (!id_paquete || !nombre || !email || !Number.isInteger(personas) || !fecha_viaje) {
    return res.status(400).json({ errores: ["id_paquete, nombre, email, personas y fecha_viaje son obligatorios"] });
  }

  try {
    const paquete = await Paquete.findByPk(id_paquete);
    if (!paquete) return res.status(404).json({ error: "Paquete no encontrado" });

    const reserva = await sequelize.transaction(async (transaction) => {
      const [cliente] = await Cliente.findOrCreate({
        where: { email: email.trim().toLowerCase() },
        defaults: { nombre, telefono, id_proveedor: paquete.id_proveedor },
        transaction,
      });
      return Reserva.create({
        id_cliente: cliente.id,
        id_paquete: paquete.id,
        id_proveedor: paquete.id_proveedor,
        id_solicitud: id_solicitud || null,
        personas,
        fecha_viaje,
        fecha_regreso: fecha_regreso || null,
        estado: "pendiente",
      }, { transaction });
    });

    res.status(201).json({ reserva, total: Number(paquete.precio) * personas });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReserva };
