// Motor de coincidencias de Rutero.
// Recibe el formulario del viajero y una lista de paquetes (objetos planos) y
// devuelve los que encajan, ordenados por puntaje (0-100) con las razones.
// Es determinista a propósito: así se puede probar y explicar. Más adelante
// se puede cambiar el cálculo del puntaje por un modelo de IA sin tocar la API.

const { PREFERENCIAS } = require("../constants");

const TOLERANCIA_PRESUPUESTO = 0.15; // aceptamos hasta 15% por encima
const TOLERANCIA_ALTERNATIVAS = 0.5;
const MAX_RESULTADOS = 20;

const PESOS = { presupuesto: 40, preferencias: 40, calificacion: 20 };

function aDia(fecha) {
  return String(fecha).slice(0, 10);
}

function sumarDias(fecha, dias) {
  const d = new Date(`${aDia(fecha)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function formatoCOP(valor) {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}

function evaluar(solicitud, paquete, { tolerancia, ignorarFecha }) {
  if (paquete.disponible === false) return null;
  if (solicitud.id_destino && Number(paquete.id_destino) !== Number(solicitud.id_destino)) return null;
  if (solicitud.tipo && paquete.tipo !== solicitud.tipo) return null;

  const personas = Number(solicitud.personas);
  if (personas < paquete.cupo_min || personas > paquete.cupo_max) return null;

  const salida = aDia(solicitud.fecha_viaje);
  const regreso = sumarDias(salida, Number(paquete.duracion_dias) - 1);
  const enTemporada = salida >= aDia(paquete.fecha_inicio) && regreso <= aDia(paquete.fecha_fin);
  if (!enTemporada && !ignorarFecha) return null;

  const presupuesto = Number(solicitud.presupuesto);
  const total = Number(paquete.precio) * personas;
  if (total > presupuesto * (1 + tolerancia)) return null;

  const razones = [];
  let puntajePresupuesto;
  if (total <= presupuesto) {
    // Dentro del presupuesto: mejor puntaje cuanto mejor aproveche lo que hay.
    puntajePresupuesto = PESOS.presupuesto * (0.5 + 0.5 * (total / presupuesto));
    const sobra = presupuesto - total;
    razones.push(sobra > 0 ? `Dentro de tu presupuesto (te sobran ${formatoCOP(sobra)})` : "Justo en tu presupuesto");
  } else {
    const exceso = (total - presupuesto) / (presupuesto * tolerancia);
    puntajePresupuesto = PESOS.presupuesto * 0.5 * (1 - exceso);
    razones.push(`Supera tu presupuesto en ${formatoCOP(total - presupuesto)}`);
  }

  const preferencias = solicitud.preferencias || [];
  const etiquetas = paquete.etiquetas || [];
  const coincidencias = preferencias.filter((p) => etiquetas.includes(p));
  let puntajePreferencias = PESOS.preferencias / 2; // neutro si no eligió preferencias
  if (preferencias.length > 0) {
    puntajePreferencias = PESOS.preferencias * (coincidencias.length / preferencias.length);
    if (coincidencias.length > 0) {
      const nombres = coincidencias.map((id) => PREFERENCIAS.find((p) => p.id === id)?.nombre || id);
      razones.push(`Coincide con: ${nombres.join(", ").toLowerCase()}`);
    }
  }

  const calificacion = Number(paquete.calificacion || 0);
  const puntajeCalificacion = PESOS.calificacion * Math.min(1, Math.max(0, (calificacion - 3) / 2));
  if (calificacion >= 4.7) razones.push(`Muy bien calificado (${calificacion.toFixed(1)})`);

  if (!enTemporada) razones.push("No está disponible en tu fecha, pero sí en otras");

  return {
    paquete,
    total,
    regreso,
    alternativa: false,
    puntaje: Math.round(puntajePresupuesto + puntajePreferencias + puntajeCalificacion),
    razones,
  };
}

function ordenar(a, b) {
  return b.puntaje - a.puntaje || a.total - b.total;
}

function buscarOfertas(solicitud, paquetes) {
  const estrictos = paquetes
    .map((p) => evaluar(solicitud, p, { tolerancia: TOLERANCIA_PRESUPUESTO, ignorarFecha: false }))
    .filter(Boolean)
    .sort(ordenar)
    .slice(0, MAX_RESULTADOS);

  if (estrictos.length > 0) return { resultados: estrictos, alternativas: [] };

  // Sin coincidencias exactas: ofrecemos opciones cercanas en vez de una pantalla vacía.
  const alternativas = paquetes
    .map((p) => evaluar(solicitud, p, { tolerancia: TOLERANCIA_ALTERNATIVAS, ignorarFecha: true }))
    .filter(Boolean)
    .map((r) => ({ ...r, alternativa: true }))
    .sort(ordenar)
    .slice(0, 5);

  return { resultados: [], alternativas };
}

module.exports = { buscarOfertas, sumarDias };
