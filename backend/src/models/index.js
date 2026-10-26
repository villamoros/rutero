const sequelize = require("../config/database");
const Proveedor = require("./Proveedor");
const CategoriaServicio = require("./CategoriaServicio");
const Servicio = require("./Servicio");
const Destino = require("./Destino");
const Paquete = require("./Paquete");
const PaqueteServicio = require("./PaqueteServicio");
const Cliente = require("./Cliente");
const Reserva = require("./Reserva");
const Solicitud = require("./Solicitud");

const cascade = { onDelete: "CASCADE" };
const setNull = { onDelete: "SET NULL" };

Proveedor.hasMany(Servicio, { foreignKey: "id_proveedor", ...cascade });
Servicio.belongsTo(Proveedor, { foreignKey: "id_proveedor", as: "proveedor" });
CategoriaServicio.hasMany(Servicio, { foreignKey: "id_categoria", ...setNull });
Servicio.belongsTo(CategoriaServicio, { foreignKey: "id_categoria", as: "categoria" });

Proveedor.hasMany(Paquete, { foreignKey: "id_proveedor", ...cascade });
Paquete.belongsTo(Proveedor, { foreignKey: "id_proveedor", as: "proveedor" });
Destino.hasMany(Paquete, { foreignKey: "id_destino", ...setNull });
Paquete.belongsTo(Destino, { foreignKey: "id_destino", as: "destino" });

Paquete.belongsToMany(Servicio, { through: PaqueteServicio, foreignKey: "id_paquete", otherKey: "id_servicio", as: "servicios" });
Servicio.belongsToMany(Paquete, { through: PaqueteServicio, foreignKey: "id_servicio", otherKey: "id_paquete", as: "paquetes" });

Proveedor.hasMany(Cliente, { foreignKey: "id_proveedor", ...cascade });
Cliente.hasMany(Reserva, { foreignKey: "id_cliente", ...cascade });
Reserva.belongsTo(Cliente, { foreignKey: "id_cliente", as: "cliente" });
Paquete.hasMany(Reserva, { foreignKey: "id_paquete", ...cascade });
Reserva.belongsTo(Paquete, { foreignKey: "id_paquete", as: "paquete" });
Proveedor.hasMany(Reserva, { foreignKey: "id_proveedor", ...cascade });
Destino.hasMany(Solicitud, { foreignKey: "id_destino", ...setNull });

module.exports = {
  sequelize, Proveedor, CategoriaServicio, Servicio, Destino, Paquete,
  PaqueteServicio, Cliente, Reserva, Solicitud,
};
