const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Tomada del diagrama relacional (tabla "destinos").
const Destino = sequelize.define("Destino", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  descripcion: DataTypes.TEXT,
  region: DataTypes.STRING,
}, { tableName: "destinos", timestamps: false });

module.exports = Destino;
