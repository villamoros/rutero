const { sequelize, Destino, Proveedor, CategoriaServicio, Servicio, Paquete } = require("../models");
const data = require("./data");

// Borra todo y carga los datos ficticios.
async function seed() {
  await sequelize.sync({ force: true });

  const destinos = await Destino.bulkCreate(data.destinos);
  const proveedores = await Proveedor.bulkCreate(data.proveedores);
  const categorias = await CategoriaServicio.bulkCreate(data.categorias.map((nombre) => ({ nombre })));

  const idPor = (lista, nombre) => {
    const item = lista.find((x) => x.nombre === nombre);
    if (!item) throw new Error(`Dato semilla no encontrado: ${nombre}`);
    return item.id;
  };

  const servicios = await Servicio.bulkCreate(
    data.servicios.map(([nombre, categoria, precio, proveedor, descripcion]) => ({
      nombre,
      descripcion,
      precio,
      id_categoria: idPor(categorias, categoria),
      id_proveedor: idPor(proveedores, proveedor),
    }))
  );

  for (const p of data.paquetes) {
    const paquete = await Paquete.create({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      tipo: p.tipo,
      duracion_dias: p.duracion_dias,
      cupo_min: p.cupo[0],
      cupo_max: p.cupo[1],
      fecha_inicio: p.temporada[0],
      fecha_fin: p.temporada[1],
      etiquetas: p.etiquetas,
      calificacion: p.calificacion,
      id_destino: idPor(destinos, p.destino),
      id_proveedor: idPor(proveedores, p.proveedor),
    });
    await paquete.setServicios(p.servicios.map((nombre) => idPor(servicios, nombre)));
  }

  return { destinos: destinos.length, proveedores: proveedores.length, servicios: servicios.length, paquetes: data.paquetes.length };
}

module.exports = seed;
