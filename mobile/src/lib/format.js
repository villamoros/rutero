export function cop(valor) {
  const entero = Math.round(Number(valor) || 0).toString();
  return `$${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function fechaCorta(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
}

export function hoyISO() {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toISO(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

// Días del viaje contando el de inicio y el de fin (12 al 15 = 4 días).
export function diasEntre(inicio, fin) {
  return Math.round((Date.parse(fin) - Date.parse(inicio)) / 86400000) + 1;
}

export function rangoCorto(inicio, fin) {
  if (!inicio) return "";
  if (!fin || fin === inicio) return fechaCorta(inicio);
  return `${fechaCorta(inicio)} al ${fechaCorta(fin)}`;
}
