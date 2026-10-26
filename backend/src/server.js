require("dotenv").config();
const app = require("./app");
const iniciarBase = require("./config/iniciarBase");

const PORT = process.env.PORT || 4000;

async function start() {
  await iniciarBase();
  console.log("✅ Base de datos conectada");
  app.listen(PORT, () => console.log(`🚀 API de Rutero en http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Error iniciando la API", err);
  process.exit(1);
});
