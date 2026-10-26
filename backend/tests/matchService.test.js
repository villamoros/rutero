const { buscarOfertas } = require("../src/services/matchService");

const base = {
  id: 1, nombre: "Pasadía", tipo: "pasadia", id_destino: 1, precio: 100000, duracion_dias: 1,
  cupo_min: 1, cupo_max: 10, fecha_inicio: "2026-11-01", fecha_fin: "2026-12-31",
  etiquetas: ["playa", "familiar"], calificacion: 4.5, disponible: true,
};
const solicitud = { modo: "destino", id_destino: 1, personas: 2, fecha_viaje: "2026-11-20", presupuesto: 300000, preferencias: ["playa"] };

describe("buscarOfertas", () => {
  test("devuelve un paquete que cumple todo, con total y razones", () => {
    const { resultados } = buscarOfertas(solicitud, [base]);
    expect(resultados).toHaveLength(1);
    expect(resultados[0].total).toBe(200000);
    expect(resultados[0].razones).toContain("Coincide con: playa");
  });

  test("filtra por destino, tipo, cupo y disponibilidad", () => {
    const paquetes = [
      { ...base, id: 2, id_destino: 2 },
      { ...base, id: 3, cupo_max: 1 },
      { ...base, id: 4, disponible: false },
      { ...base, id: 5, tipo: "tour" },
    ];
    expect(buscarOfertas({ ...solicitud, tipo: "pasadia" }, paquetes).resultados).toHaveLength(0);
  });

  test("exige que el viaje completo quepa en la temporada", () => {
    const largo = { ...base, duracion_dias: 5, fecha_fin: "2026-11-22" };
    expect(buscarOfertas(solicitud, [largo]).resultados).toHaveLength(0);
  });

  test("con fecha de fin solo deja los planes que caben entre inicio y fin", () => {
    const tour3 = { ...base, id: 2, tipo: "tour", duracion_dias: 3 };
    const tour5 = { ...base, id: 3, tipo: "tour", duracion_dias: 5 };
    const rango = { ...solicitud, tipo: "tour", fecha_regreso: "2026-11-23" }; // 4 días
    expect(buscarOfertas(rango, [tour3, tour5]).resultados.map((r) => r.paquete.id)).toEqual([2]);
  });

  test("acepta hasta 15% por encima del presupuesto y lo avisa", () => {
    const caro = { ...base, precio: 170000 }; // 340.000 para 2, 13% más
    const muyCaro = { ...base, id: 9, precio: 180000 }; // 20% más
    const { resultados } = buscarOfertas(solicitud, [caro, muyCaro]);
    expect(resultados.map((r) => r.paquete.id)).toEqual([1]);
    expect(resultados[0].razones[0]).toMatch(/Supera tu presupuesto/);
  });

  test("ordena por coincidencia con las preferencias", () => {
    const cultural = { ...base, id: 2, etiquetas: ["cultural"] };
    const { resultados } = buscarOfertas({ ...solicitud, preferencias: ["playa", "familiar"] }, [cultural, base]);
    expect(resultados[0].paquete.id).toBe(1);
  });

  test("en modo presupuesto busca en todos los destinos", () => {
    const otro = { ...base, id: 2, id_destino: 7 };
    const { resultados } = buscarOfertas({ ...solicitud, modo: "presupuesto", id_destino: null }, [base, otro]);
    expect(resultados).toHaveLength(2);
  });

  test("sin coincidencias exactas propone alternativas en otras fechas", () => {
    const { resultados, alternativas } = buscarOfertas({ ...solicitud, fecha_viaje: "2027-03-01" }, [base]);
    expect(resultados).toHaveLength(0);
    expect(alternativas).toHaveLength(1);
    expect(alternativas[0].alternativa).toBe(true);
  });
});
