const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Tabla nueva: guarda cada formulario enviado desde la app.
// Equivale a usuarios.preferencias del diagrama, pero sin exigir registro en el MVP.
const Solicitud = sequelize.define("Solicitud", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modo: { type: DataTypes.STRING(20), allowNull: false, validate: { isIn: [["destino", "presupuesto"]] } },
  id_destino: DataTypes.INTEGER,
  tipo: DataTypes.STRING(20),
  personas: { type: DataTypes.INTEGER, allowNull: false },
  fecha_viaje: { type: DataTypes.DATEONLY, allowNull: false },
  presupuesto: { type: DataTypes.DECIMAL(12, 2), allowNull: false }, // total para el grupo
  preferencias: { type: DataTypes.JSON, defaultValue: [] },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "solicitudes", timestamps: false });

module.exports = Solicitud;
