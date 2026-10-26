const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Hoteles, transportes, alimentación, actividades, etc.
const Servicio = sequelize.define("Servicio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: DataTypes.TEXT,
  id_categoria: DataTypes.INTEGER,
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  id_proveedor: DataTypes.INTEGER,
}, { tableName: "servicios", timestamps: false });

module.exports = Servicio;
