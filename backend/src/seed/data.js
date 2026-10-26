// Datos ficticios para el MVP. Nombres, correos y precios (COP por persona) son inventados.

const destinos = [
  { nombre: "Nuquí", region: "Chocó", descripcion: "Selva que llega al mar, termales, comunidades afro y avistamiento de ballenas." },
  { nombre: "Bahía Solano", region: "Chocó", descripcion: "Playas de El Valle, buceo, cascadas y desove de tortugas." },
  { nombre: "Capurganá", region: "Chocó", descripcion: "Caribe chocoano sin carros: piscinas naturales y caminatas a Sapzurro." },
  { nombre: "Juanchaco y Ladrilleros", region: "Valle del Cauca", descripcion: "Playas cerca de Buenaventura, acantilados y planes de fin de semana." },
  { nombre: "Bahía Málaga", region: "Valle del Cauca", descripcion: "Parque nacional con esteros, cascadas y ballenas jorobadas." },
  { nombre: "Isla Gorgona", region: "Cauca", descripcion: "Parque nacional natural: buceo, historia y biodiversidad marina." },
  { nombre: "Guapi", region: "Cauca", descripcion: "Música de marimba, cocina tradicional y manglares." },
  { nombre: "Tumaco", region: "Nariño", descripcion: "El Morro, playas de Bocagrande y cultura del Pacífico sur." },
];

const proveedores = [
  { nombre: "Lanchas del Pacífico", email: "reservas@lanchasdelpacifico.test", telefono: "3000000001", direccion: "Muelle turístico, Buenaventura" },
  { nombre: "Eco-lodge Mar y Selva", email: "hola@maryselva.test", telefono: "3000000002", direccion: "Playa Guachalito, Nuquí" },
  { nombre: "Guías Comunitarios del Chocó", email: "guias@guiaschoco.test", telefono: "3000000003", direccion: "Barrio Pueblo Nuevo, Nuquí" },
  { nombre: "Bahía Aventura Tours", email: "info@bahiaaventura.test", telefono: "3000000004", direccion: "El Valle, Bahía Solano" },
  { nombre: "Sabores del Pacífico", email: "cocina@saborespacifico.test", telefono: "3000000005", direccion: "Calle del Comercio, Guapi" },
  { nombre: "Caribe Chocoano Expediciones", email: "viajes@caribechocoano.test", telefono: "3000000006", direccion: "Muelle de Capurganá" },
];

const categorias = ["Transporte", "Hospedaje", "Alimentación", "Actividad"];

// [nombre, categoría, precio, proveedor, descripción]
const servicios = [
  ["Lancha Buenaventura - Juanchaco", "Transporte", 90000, "Lanchas del Pacífico", "Ida y regreso, 1 hora por trayecto."],
  ["Lancha Buenaventura - Bahía Málaga", "Transporte", 110000, "Lanchas del Pacífico", "Ida y regreso con chaleco y seguro."],
  ["Lancha Guapi - Gorgona", "Transporte", 380000, "Lanchas del Pacífico", "Ida y regreso, incluye permiso de zarpe."],
  ["Vuelo Medellín - Nuquí", "Transporte", 780000, "Eco-lodge Mar y Selva", "Avioneta ida y regreso, 10 kg de equipaje."],
  ["Vuelo Medellín - Bahía Solano", "Transporte", 720000, "Bahía Aventura Tours", "Avioneta ida y regreso."],
  ["Lancha Necoclí - Capurganá", "Transporte", 180000, "Caribe Chocoano Expediciones", "Ida y regreso, 2 horas por trayecto."],
  ["Traslado aeropuerto - hotel", "Transporte", 40000, "Bahía Aventura Tours", "Lancha o mototaxi según destino."],
  ["Noche en cabaña frente al mar", "Hospedaje", 220000, "Eco-lodge Mar y Selva", "Cabaña de madera con baño privado."],
  ["Noche en hostal comunitario", "Hospedaje", 90000, "Guías Comunitarios del Chocó", "Habitación compartida en casa de familia."],
  ["Noche en eco-hotel con vista", "Hospedaje", 380000, "Bahía Aventura Tours", "Suite con terraza y desayuno gourmet."],
  ["Noche en camping equipado", "Hospedaje", 60000, "Caribe Chocoano Expediciones", "Carpa, colchoneta y baño compartido."],
  ["Almuerzo típico", "Alimentación", 45000, "Sabores del Pacífico", "Pescado frito, arroz con coco y patacón."],
  ["Pensión completa", "Alimentación", 120000, "Eco-lodge Mar y Selva", "Desayuno, almuerzo y cena por persona."],
  ["Taller de cocina del Pacífico", "Alimentación", 85000, "Sabores del Pacífico", "Prepara encocado y cocadas con cocineras locales."],
  ["Avistamiento de ballenas", "Actividad", 150000, "Lanchas del Pacífico", "Salida de 3 horas con guía (jul - oct)."],
  ["Caminata a cascada", "Actividad", 50000, "Guías Comunitarios del Chocó", "Sendero de selva con guía local."],
  ["Termales de Termales", "Actividad", 35000, "Guías Comunitarios del Chocó", "Entrada y guía a los termales."],
  ["Buceo con dos inmersiones", "Actividad", 320000, "Bahía Aventura Tours", "Equipo completo e instructor certificado."],
  ["Liberación de tortugas", "Actividad", 60000, "Bahía Aventura Tours", "Con el vivero comunitario de El Valle."],
  ["Kayak por manglares", "Actividad", 70000, "Guías Comunitarios del Chocó", "Recorrido de 2 horas por esteros."],
  ["Noche de marimba y cantos", "Actividad", 40000, "Sabores del Pacífico", "Música en vivo con agrupación local."],
  ["Snorkel en piscinas naturales", "Actividad", 60000, "Caribe Chocoano Expediciones", "Equipo incluido."],
  ["Caminata a Sapzurro y La Miel", "Actividad", 50000, "Caribe Chocoano Expediciones", "Cruce a pie hasta la frontera con Panamá."],
  ["Seguro de viaje básico", "Actividad", 15000, "Lanchas del Pacífico", "Cobertura de asistencia durante el plan."],
];

const TODO_EL_ANIO = ["2026-10-01", "2027-12-31"];
const BALLENAS_2026 = ["2026-07-01", "2026-11-15"];
const BALLENAS_2027 = ["2027-07-01", "2027-11-15"];

// precio = por persona, en COP
const paquetes = [
  // Pasadías
  { nombre: "Pasadía en Ladrilleros", tipo: "pasadia", destino: "Juanchaco y Ladrilleros", proveedor: "Lanchas del Pacífico", precio: 180000, duracion_dias: 1, cupo: [1, 20], temporada: TODO_EL_ANIO, etiquetas: ["playa", "familiar", "economico"], calificacion: 4.4, descripcion: "Sal temprano de Buenaventura, disfruta la playa de Ladrilleros y regresa en la tarde.", servicios: ["Lancha Buenaventura - Juanchaco", "Almuerzo típico", "Seguro de viaje básico"] },
  { nombre: "Pasadía de cascadas en Bahía Málaga", tipo: "pasadia", destino: "Bahía Málaga", proveedor: "Lanchas del Pacífico", precio: 240000, duracion_dias: 1, cupo: [2, 16], temporada: TODO_EL_ANIO, etiquetas: ["ecologico", "aventura", "playa"], calificacion: 4.7, descripcion: "Recorrido en lancha por los esteros y baño en cascadas que caen al mar.", servicios: ["Lancha Buenaventura - Bahía Málaga", "Caminata a cascada", "Almuerzo típico", "Seguro de viaje básico"] },
  { nombre: "Pasadía de ballenas en Bahía Málaga", tipo: "pasadia", destino: "Bahía Málaga", proveedor: "Lanchas del Pacífico", precio: 320000, duracion_dias: 1, cupo: [2, 12], temporada: BALLENAS_2026, etiquetas: ["avistamiento", "ecologico", "familiar"], calificacion: 4.9, descripcion: "Salida en temporada de ballenas jorobadas con guía y almuerzo.", servicios: ["Lancha Buenaventura - Bahía Málaga", "Avistamiento de ballenas", "Almuerzo típico", "Seguro de viaje básico"] },
  { nombre: "Ballenas 2027 en Bahía Málaga", tipo: "pasadia", destino: "Bahía Málaga", proveedor: "Lanchas del Pacífico", precio: 330000, duracion_dias: 1, cupo: [2, 12], temporada: BALLENAS_2027, etiquetas: ["avistamiento", "ecologico", "familiar"], calificacion: 4.9, descripcion: "Reserva desde ya la próxima temporada de ballenas.", servicios: ["Lancha Buenaventura - Bahía Málaga", "Avistamiento de ballenas", "Almuerzo típico", "Seguro de viaje básico"] },
  { nombre: "Pasadía de piscinas naturales en Capurganá", tipo: "pasadia", destino: "Capurganá", proveedor: "Caribe Chocoano Expediciones", precio: 260000, duracion_dias: 1, cupo: [1, 20], temporada: TODO_EL_ANIO, etiquetas: ["playa", "relax", "familiar"], calificacion: 4.5, descripcion: "Lancha desde Necoclí, snorkel en piscinas naturales y almuerzo de mar.", servicios: ["Lancha Necoclí - Capurganá", "Snorkel en piscinas naturales", "Almuerzo típico"] },
  { nombre: "Pasadía cultural en Guapi", tipo: "pasadia", destino: "Guapi", proveedor: "Sabores del Pacífico", precio: 150000, duracion_dias: 1, cupo: [1, 25], temporada: TODO_EL_ANIO, etiquetas: ["cultural", "gastronomico", "economico"], calificacion: 4.8, descripcion: "Cocina con sabedoras locales y cierra el día con marimba en vivo.", servicios: ["Taller de cocina del Pacífico", "Noche de marimba y cantos", "Almuerzo típico"] },
  { nombre: "Pasadía de manglares en Tumaco", tipo: "pasadia", destino: "Tumaco", proveedor: "Guías Comunitarios del Chocó", precio: 130000, duracion_dias: 1, cupo: [1, 15], temporada: TODO_EL_ANIO, etiquetas: ["ecologico", "aventura", "economico"], calificacion: 4.3, descripcion: "Kayak entre manglares y almuerzo en Bocagrande.", servicios: ["Kayak por manglares", "Almuerzo típico"] },

  // Tours
  { nombre: "Tour de termales y cascadas de Nuquí", tipo: "tour", destino: "Nuquí", proveedor: "Guías Comunitarios del Chocó", precio: 420000, duracion_dias: 2, cupo: [2, 10], temporada: TODO_EL_ANIO, etiquetas: ["ecologico", "aventura", "relax"], calificacion: 4.8, descripcion: "Dos días con guías nativos: cascadas, termales y una noche en casa de familia.", servicios: ["Caminata a cascada", "Termales de Termales", "Noche en hostal comunitario", "Pensión completa"] },
  { nombre: "Tour de buceo en Bahía Solano", tipo: "tour", destino: "Bahía Solano", proveedor: "Bahía Aventura Tours", precio: 950000, duracion_dias: 2, cupo: [1, 8], temporada: TODO_EL_ANIO, etiquetas: ["aventura", "playa", "lujo"], calificacion: 4.6, descripcion: "Dos inmersiones en el Pacífico y noche en eco-hotel con vista.", servicios: ["Buceo con dos inmersiones", "Noche en eco-hotel con vista", "Pensión completa", "Traslado aeropuerto - hotel"] },
  { nombre: "Tour de tortugas en El Valle", tipo: "tour", destino: "Bahía Solano", proveedor: "Bahía Aventura Tours", precio: 380000, duracion_dias: 2, cupo: [2, 14], temporada: ["2026-08-01", "2027-01-31"], etiquetas: ["avistamiento", "ecologico", "familiar"], calificacion: 4.7, descripcion: "Acompaña la liberación de tortugas con el vivero comunitario.", servicios: ["Liberación de tortugas", "Noche en hostal comunitario", "Pensión completa"] },
  { nombre: "Tour Capurganá - Sapzurro", tipo: "tour", destino: "Capurganá", proveedor: "Caribe Chocoano Expediciones", precio: 340000, duracion_dias: 2, cupo: [1, 12], temporada: TODO_EL_ANIO, etiquetas: ["aventura", "playa", "economico"], calificacion: 4.6, descripcion: "Caminata por la selva hasta Sapzurro y La Miel, con noche de camping.", servicios: ["Caminata a Sapzurro y La Miel", "Noche en camping equipado", "Almuerzo típico", "Snorkel en piscinas naturales"] },
  { nombre: "Tour gastronómico del Pacífico sur", tipo: "tour", destino: "Guapi", proveedor: "Sabores del Pacífico", precio: 360000, duracion_dias: 2, cupo: [2, 12], temporada: TODO_EL_ANIO, etiquetas: ["gastronomico", "cultural"], calificacion: 4.9, descripcion: "Mercado, cocina tradicional y música de marimba.", servicios: ["Taller de cocina del Pacífico", "Noche en hostal comunitario", "Pensión completa", "Noche de marimba y cantos"] },
  { nombre: "Tour expedición Gorgona", tipo: "tour", destino: "Isla Gorgona", proveedor: "Lanchas del Pacífico", precio: 1250000, duracion_dias: 3, cupo: [2, 10], temporada: TODO_EL_ANIO, etiquetas: ["ecologico", "aventura", "avistamiento"], calificacion: 4.8, descripcion: "Tres días en el parque nacional: senderos, snorkel y la historia de la antigua prisión.", servicios: ["Lancha Guapi - Gorgona", "Pensión completa", "Caminata a cascada", "Seguro de viaje básico"] },

  // Paquetes completos
  { nombre: "Nuquí esencial 4 días", tipo: "paquete_completo", destino: "Nuquí", proveedor: "Eco-lodge Mar y Selva", precio: 2100000, duracion_dias: 4, cupo: [1, 12], temporada: TODO_EL_ANIO, etiquetas: ["playa", "ecologico", "relax"], calificacion: 4.8, descripcion: "Vuelo desde Medellín, cabaña frente al mar, comidas y actividades en la selva.", servicios: ["Vuelo Medellín - Nuquí", "Noche en cabaña frente al mar", "Pensión completa", "Caminata a cascada", "Termales de Termales"] },
  { nombre: "Nuquí ballenas 5 días", tipo: "paquete_completo", destino: "Nuquí", proveedor: "Eco-lodge Mar y Selva", precio: 2900000, duracion_dias: 5, cupo: [2, 10], temporada: BALLENAS_2027, etiquetas: ["avistamiento", "playa", "lujo"], calificacion: 4.9, descripcion: "La temporada de ballenas con todo incluido desde Medellín.", servicios: ["Vuelo Medellín - Nuquí", "Noche en cabaña frente al mar", "Pensión completa", "Avistamiento de ballenas", "Termales de Termales"] },
  { nombre: "Nuquí mochilero 4 días", tipo: "paquete_completo", destino: "Nuquí", proveedor: "Guías Comunitarios del Chocó", precio: 1450000, duracion_dias: 4, cupo: [1, 8], temporada: TODO_EL_ANIO, etiquetas: ["economico", "aventura", "cultural"], calificacion: 4.5, descripcion: "Hospedaje comunitario y guías locales para viajar con poco.", servicios: ["Vuelo Medellín - Nuquí", "Noche en hostal comunitario", "Almuerzo típico", "Caminata a cascada", "Kayak por manglares"] },
  { nombre: "Bahía Solano completo 5 días", tipo: "paquete_completo", destino: "Bahía Solano", proveedor: "Bahía Aventura Tours", precio: 2600000, duracion_dias: 5, cupo: [1, 10], temporada: TODO_EL_ANIO, etiquetas: ["playa", "aventura", "ecologico"], calificacion: 4.7, descripcion: "Vuelo, eco-hotel, buceo, tortugas y cascadas.", servicios: ["Vuelo Medellín - Bahía Solano", "Traslado aeropuerto - hotel", "Noche en eco-hotel con vista", "Pensión completa", "Buceo con dos inmersiones", "Liberación de tortugas"] },
  { nombre: "Ladrilleros fin de semana", tipo: "paquete_completo", destino: "Juanchaco y Ladrilleros", proveedor: "Lanchas del Pacífico", precio: 520000, duracion_dias: 3, cupo: [1, 20], temporada: TODO_EL_ANIO, etiquetas: ["playa", "familiar", "economico"], calificacion: 4.3, descripcion: "Tres días de playa con hospedaje sencillo y comidas.", servicios: ["Lancha Buenaventura - Juanchaco", "Noche en hostal comunitario", "Pensión completa", "Seguro de viaje básico"] },
  { nombre: "Capurganá relax 4 días", tipo: "paquete_completo", destino: "Capurganá", proveedor: "Caribe Chocoano Expediciones", precio: 1150000, duracion_dias: 4, cupo: [1, 14], temporada: TODO_EL_ANIO, etiquetas: ["playa", "relax", "familiar"], calificacion: 4.6, descripcion: "Playas tranquilas, snorkel y caminata a Sapzurro.", servicios: ["Lancha Necoclí - Capurganá", "Noche en cabaña frente al mar", "Pensión completa", "Snorkel en piscinas naturales", "Caminata a Sapzurro y La Miel"] },
  { nombre: "Tumaco y El Morro 3 días", tipo: "paquete_completo", destino: "Tumaco", proveedor: "Sabores del Pacífico", precio: 690000, duracion_dias: 3, cupo: [1, 15], temporada: TODO_EL_ANIO, etiquetas: ["playa", "cultural", "gastronomico"], calificacion: 4.2, descripcion: "Playas de Bocagrande, cocina tumaqueña y música en vivo.", servicios: ["Noche en hostal comunitario", "Pensión completa", "Kayak por manglares", "Noche de marimba y cantos"] },
];

module.exports = { destinos, proveedores, categorias, servicios, paquetes };
