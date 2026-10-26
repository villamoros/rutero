const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define("Cliente", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  telefono: DataTypes.STRING(20),
  id_proveedor: DataTypes.INTEGER,
}, { tableName: "clientes", timestamps: false });

module.exports = Cliente;
