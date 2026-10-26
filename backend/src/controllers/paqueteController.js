const { Paquete, Destino, Proveedor, Servicio, CategoriaServicio } = require("../models");

async function getPackage(req, res, next) {
  try {
    const paquete = await Paquete.findByPk(req.params.id, {
      include: [
        { model: Destino, as: "destino" },
        { model: Proveedor, as: "proveedor", attributes: ["id", "nombre", "email", "telefono"] },
        {
          model: Servicio,
          as: "servicios",
          through: { attributes: [] },
          include: [{ model: CategoriaServicio, as: "categoria" }],
        },
      ],
    });
    if (!paquete) return res.status(404).json({ error: "Paquete no encontrado" });
    res.json(paquete);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPackage };
