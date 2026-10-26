const sequelize = require("./database");

let inicio = null;

// sync() no modifica tablas que ya existen: agregamos a mano las columnas nuevas
// para que una base creada antes (SQLite o PostgreSQL) siga funcionando sin borrarla.
async function agregarColumnasNuevas() {
  const { Reserva, Solicitud } = sequelize.models;
  const qi = sequelize.getQueryInterface();
  for (const modelo of [Solicitud, Reserva]) {
    const tabla = modelo.getTableName();
    const existentes = await qi.describeTable(tabla);
    for (const [nombre, atributo] of Object.entries(modelo.getAttributes())) {
      if (!existentes[nombre]) await qi.addColumn(tabla, nombre, { type: atributo.type, allowNull: true });
    }
  }
}

// Prepara la base una sola vez por proceso. En Vercel cada función arranca en frío,
// así que esto corre con la primera petición y no al desplegar.
function iniciarBase() {
  if (!inicio) {
    inicio = (async () => {
      const { Paquete } = require("../models");
      const seed = require("../seed");
      await sequelize.sync();
      await agregarColumnasNuevas();
      // Con la base vacía cargamos los datos ficticios para que la app tenga qué mostrar.
      if ((await Paquete.count()) === 0) await seed();
    })().catch((err) => {
      inicio = null; // que la siguiente petición lo vuelva a intentar
      throw err;
    });
  }
  return inicio;
}

module.exports = iniciarBase;
