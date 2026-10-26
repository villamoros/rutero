const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaqueteServicio = sequelize.define("PaqueteServicio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_paquete: DataTypes.INTEGER,
  id_servicio: DataTypes.INTEGER,
}, { tableName: "paquete_servicios", timestamps: false });

module.exports = PaqueteServicio;
