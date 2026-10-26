const { Destino } = require("../models");
const { TIPOS, PREFERENCIAS } = require("../constants");

async function getOpciones(req, res, next) {
  try {
    const destinos = await Destino.findAll({ order: [["nombre", "ASC"]] });
    res.json({ destinos, tipos: TIPOS, preferencias: PREFERENCIAS });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOpciones };
