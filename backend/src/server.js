require("dotenv").config();
const app = require("./app");
const { sequelize, Paquete } = require("./models");
const seed = require("./seed");

const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.sync();
  // Con la base vacía cargamos los datos ficticios para que la app tenga qué mostrar.
  if ((await Paquete.count()) === 0) await seed();
  console.log("✅ Base de datos conectada");
  app.listen(PORT, () => console.log(`🚀 API de Rutero en http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Error iniciando la API", err);
  process.exit(1);
});
