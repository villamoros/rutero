import { createContext, useContext, useState } from "react";

// Guarda el último formulario y sus resultados para compartirlos entre pantallas.
const BusquedaContext = createContext(null);

export function BusquedaProvider({ children }) {
  const [busqueda, setBusqueda] = useState(null);
  return <BusquedaContext.Provider value={{ busqueda, setBusqueda }}>{children}</BusquedaContext.Provider>;
}

export function useBusqueda() {
  return useContext(BusquedaContext);
}
