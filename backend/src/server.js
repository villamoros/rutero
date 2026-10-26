require("dotenv").config();
const app = require("./app");
const { sequelize, Paquete, Reserva, Solicitud } = require("./models");
const seed = require("./seed");

const PORT = process.env.PORT || 4000;

// sync() no modifica tablas que ya existen: agregamos a mano las columnas nuevas
// para que una base creada antes (SQLite o PostgreSQL) siga funcionando sin borrarla.
async function agregarColumnasNuevas() {
  const qi = sequelize.getQueryInterface();
  for (const modelo of [Solicitud, Reserva]) {
    const tabla = modelo.getTableName();
    const existentes = await qi.describeTable(tabla);
    for (const [nombre, atributo] of Object.entries(modelo.getAttributes())) {
      if (!existentes[nombre]) await qi.addColumn(tabla, nombre, { type: atributo.type, allowNull: true });
    }
  }
}

async function start() {
  await sequelize.sync();
  await agregarColumnasNuevas();
  // Con la base vacía cargamos los datos ficticios para que la app tenga qué mostrar.
  if ((await Paquete.count()) === 0) await seed();
  console.log("✅ Base de datos conectada");
  app.listen(PORT, () => console.log(`🚀 API de Rutero en http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Error iniciando la API", err);
  process.exit(1);
});
