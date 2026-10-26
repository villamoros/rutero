const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ESTADOS = ["pendiente", "confirmada", "cancelada", "completada"];

const Reserva = sequelize.define("Reserva", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: DataTypes.INTEGER,
  id_paquete: DataTypes.INTEGER,
  fecha_reserva: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.STRING(20), defaultValue: "pendiente", validate: { isIn: [ESTADOS] } },
  id_proveedor: DataTypes.INTEGER,
  fecha_viaje: DataTypes.DATEONLY, // *
  personas: { type: DataTypes.INTEGER, defaultValue: 1 }, // *
  id_solicitud: DataTypes.INTEGER, // * formulario que originó la reserva
}, { tableName: "reservas", timestamps: false });

module.exports = Reserva;
