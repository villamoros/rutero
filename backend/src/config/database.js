const { Sequelize } = require("sequelize");
require("dotenv").config();

// En producción se usa PostgreSQL (como en la documentación de Notion).
// - DATABASE_URL: la cadena de conexión que dan Neon, Supabase o Vercel (con SSL).
// - DB_HOST, DB_NAME, DB_USER, DB_PASS: un PostgreSQL local.
// Para el MVP con datos ficticios, si no hay ninguna de las dos se usa SQLite local.
let sequelize;
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (url) {
  sequelize = new Sequelize(url, {
    dialect: "postgres",
    dialectModule: require("pg"), // explícito para que el empaquetador de Vercel lo incluya
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    pool: { max: 3 },
    logging: false,
  });
} else if (process.env.DB_HOST) {
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
