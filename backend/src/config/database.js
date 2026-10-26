const { Sequelize } = require("sequelize");
require("dotenv").config();

// En producción se usa PostgreSQL (como en la documentación de Notion).
// Para el MVP con datos ficticios, si no hay DB_HOST se usa SQLite local.
let sequelize;
if (process.env.DB_HOST) {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.NODE_ENV === "test" ? ":memory:" : process.env.SQLITE_FILE || "rutero.sqlite",
    logging: false,
  });
}

module.exports = sequelize;
