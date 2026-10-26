const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const mensaje = body.errores ? body.errores.join("\n") : body.error || "No pudimos conectar con Rutero";
    throw new Error(mensaje);
  }
  return body;
}

export const api = {
  opciones: () => request("/opciones"),
  buscar: (solicitud) => request("/solicitudes", { method: "POST", body: JSON.stringify(solicitud) }),
  paquete: (id) => request(`/paquetes/${id}`),
  reservar: (datos) => request("/reservas", { method: "POST", body: JSON.stringify(datos) }),
};
