const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CategoriaServicio = sequelize.define("CategoriaServicio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
}, { tableName: "categorias_servicios", timestamps: false });

module.exports = CategoriaServicio;
