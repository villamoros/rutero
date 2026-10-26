require("dotenv").config();
const seed = require(".");

seed()
  .then((totales) => {
    console.log("🌱 Datos semilla cargados:", totales);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
