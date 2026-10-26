const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TIPOS = ["pasadia", "tour", "paquete_completo"];

// Tabla "paquetes" del Notion. Columnas añadidas para el MVP (marcadas con *)
// porque el buscador necesita saber dónde, cuándo, para cuántos y para quién es la oferta.
const Paquete = sequelize.define("Paquete", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: DataTypes.TEXT,
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // por persona, en COP
  id_proveedor: DataTypes.INTEGER,
  tipo: { type: DataTypes.STRING(20), allowNull: false, validate: { isIn: [TIPOS] } }, // *
  id_destino: DataTypes.INTEGER, // *
  duracion_dias: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // *
  cupo_min: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // *
  cupo_max: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20 }, // *
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false }, // * temporada en que se ofrece
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: false }, // *
  etiquetas: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // * playa, aventura, cultural...
  calificacion: { type: DataTypes.DECIMAL(2, 1), defaultValue: 4.5 }, // *
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true }, // * "disponibilidad" en el diagrama
}, { tableName: "paquetes", timestamps: false });

Paquete.TIPOS = TIPOS;
module.exports = Paquete;
