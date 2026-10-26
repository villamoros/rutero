// Opciones del formulario. La app las pide a la API para no duplicarlas.
const TIPOS = [
  { id: "pasadia", nombre: "Pasadía" },
  { id: "tour", nombre: "Tour" },
  { id: "paquete_completo", nombre: "Paquete completo" },
];

const PREFERENCIAS = [
  { id: "playa", nombre: "Playa" },
  { id: "aventura", nombre: "Aventura" },
  { id: "ecologico", nombre: "Ecológico" },
  { id: "cultural", nombre: "Cultural" },
  { id: "gastronomico", nombre: "Gastronómico" },
  { id: "avistamiento", nombre: "Avistamiento de fauna" },
  { id: "relax", nombre: "Relax" },
  { id: "familiar", nombre: "Familiar" },
  { id: "economico", nombre: "Económico" },
  { id: "lujo", nombre: "Lujo" },
];

module.exports = { TIPOS, PREFERENCIAS };
