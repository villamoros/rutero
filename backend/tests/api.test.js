const request = require("supertest");
const app = require("../src/app");
const seed = require("../src/seed");
const { sequelize, Reserva, Solicitud, Destino } = require("../src/models");

let nuqui;

beforeAll(async () => {
  await seed();
  nuqui = await Destino.findOne({ where: { nombre: "Nuquí" } });
});
afterAll(() => sequelize.close());

describe("API de Rutero", () => {
  test("GET /api/opciones devuelve destinos, tipos y preferencias", async () => {
    const res = await request(app).get("/api/opciones").expect(200);
    expect(res.body.destinos).toHaveLength(8);
    expect(res.body.tipos.map((t) => t.id)).toEqual(["pasadia", "tour", "paquete_completo"]);
  });

  test("POST /api/solicitudes valida el formulario", async () => {
    const res = await request(app).post("/api/solicitudes").send({ modo: "destino", personas: 0 }).expect(400);
    expect(res.body.errores.length).toBeGreaterThan(1);
  });

  test("POST /api/solicitudes guarda el formulario y devuelve ofertas de ese destino", async () => {
    const res = await request(app).post("/api/solicitudes").send({
      modo: "destino", id_destino: nuqui.id, personas: 2, fecha_viaje: "2027-02-10",
      presupuesto: 5000000, preferencias: ["playa", "ecologico"],
    }).expect(201);
    expect(res.body.resultados.length).toBeGreaterThan(0);
    expect(res.body.resultados.every((r) => r.destino === "Nuquí")).toBe(true);
    expect(res.body.resultados[0].nombre).toBe("Nuquí esencial 4 días");
    expect(await Solicitud.count()).toBe(1);
  });

  test("POST /api/solicitudes en modo presupuesto mezcla destinos", async () => {
    const res = await request(app).post("/api/solicitudes").send({
      modo: "presupuesto", personas: 4, fecha_viaje: "2026-12-05", presupuesto: 1200000, tipo: "pasadia",
    }).expect(201);
    const destinos = new Set(res.body.resultados.map((r) => r.destino));
    expect(destinos.size).toBeGreaterThan(1);
    expect(res.body.resultados.every((r) => r.tipo === "pasadia" && r.total <= 1200000 * 1.15)).toBe(true);
  });

  test("GET /api/paquetes/:id incluye servicios, destino y proveedor", async () => {
    const res = await request(app).get("/api/paquetes/1").expect(200);
    expect(res.body.servicios.length).toBeGreaterThan(0);
    expect(res.body.servicios[0].categoria.nombre).toBeDefined();
    expect(res.body.destino.nombre).toBeDefined();
    await request(app).get("/api/paquetes/999").expect(404);
  });

  test("POST /api/reservas crea cliente y reserva pendiente", async () => {
    const res = await request(app).post("/api/reservas").send({
      id_paquete: 1, nombre: "Viajera Prueba", email: "viajera@example.com", personas: 2, fecha_viaje: "2026-12-05",
    }).expect(201);
    expect(res.body.reserva.estado).toBe("pendiente");
    expect(res.body.total).toBe(360000);
    expect(await Reserva.count()).toBe(1);
  });
});
