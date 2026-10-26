import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Calendario from "../components/Calendario";
import { BarraProgreso, Entrada } from "../components/Entrada";
import { Boton, Chip } from "../components/ui";
import { api } from "../lib/api";
import { useBusqueda } from "../lib/busqueda";
import { cop, diasEntre, fechaCorta, rangoCorto } from "../lib/format";
import { colors, fonts } from "../lib/theme";

// Formulario progresivo del wireframe: "Tengo un destino" y "Tengo un presupuesto"
// comparten pasos, solo cambia el orden y si se pregunta el destino.
const PASOS = {
  destino: ["destino", "tipo", "personas", "fecha", "preferencias", "presupuesto", "resumen"],
  presupuesto: ["presupuesto", "tipo", "personas", "fecha", "preferencias", "resumen"],
};

const TITULOS = {
  destino: "¿A dónde quieres ir?",
  tipo: "¿Qué tipo de plan buscas?",
  personas: "¿Cuántas personas viajan?",
  fecha: "¿Cuándo viajas?",
  preferencias: "¿Qué te gusta?",
  presupuesto: "¿Cuánto quieres gastar en total?",
  resumen: "Revisa tu búsqueda",
};

const PRESUPUESTOS_RAPIDOS = [500000, 1000000, 2000000, 5000000];

export default function Formulario() {
  const { modo = "destino" } = useLocalSearchParams();
  const pasos = PASOS[modo] || PASOS.destino;
  const { setBusqueda } = useBusqueda();

  const [opciones, setOpciones] = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [form, setForm] = useState({
    id_destino: null, tipo: "", personas: 2, fecha_viaje: null, fecha_regreso: null, preferencias: [], presupuesto: "",
  });

  // Solo el contenido del paso se anima: entra desde la derecha al avanzar y desde la izquierda al volver.
  const direccion = useRef(1);
  const scroll = useRef(null);

  const cargar = () => {
    setErrorCarga(null);
    api.opciones().then(setOpciones).catch((e) => setErrorCarga(e.message));
  };
  useEffect(cargar, []);

  const actual = pasos[paso];
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  // Pasadía es un solo día; tour y paquete completo llevan fecha de inicio y de fin.
  const pasadia = form.tipo === "pasadia";
  const finObligatorio = form.tipo === "tour" || form.tipo === "paquete_completo";

  function elegirTipo(tipo) {
    setForm((f) => ({ ...f, tipo, fecha_regreso: tipo === "pasadia" ? null : f.fecha_regreso }));
  }

  function irA(nuevo) {
    direccion.current = nuevo > paso ? 1 : -1;
    setPaso(nuevo);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }

  const puedeSeguir = useMemo(() => {
    if (actual === "destino") return !!form.id_destino;
    if (actual === "fecha") return !!form.fecha_viaje && (!finObligatorio || !!form.fecha_regreso);
    if (actual === "presupuesto") return Number(form.presupuesto) > 0;
    return true;
  }, [actual, form, finObligatorio]);

  async function buscar() {
    setEnviando(true);
    setErrorEnvio(null);
    const solicitud = {
      modo,
      id_destino: modo === "destino" ? form.id_destino : undefined,
      tipo: form.tipo || undefined,
      personas: form.personas,
      fecha_viaje: form.fecha_viaje,
      fecha_regreso: !pasadia && form.fecha_regreso ? form.fecha_regreso : undefined,
      presupuesto: Number(form.presupuesto),
      preferencias: form.preferencias,
    };
    try {
      const respuesta = await api.buscar(solicitud);
      setBusqueda({ solicitud, ...respuesta });
      router.push("/resultados");
    } catch (e) {
      setErrorEnvio(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (errorCarga) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{errorCarga}</Text>
        <Boton titulo="Reintentar" onPress={cargar} style={{ marginTop: 16 }} />
      </View>
    );
  }
  if (!opciones) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.tinta} size="large" />
      </View>
    );
  }

  const nombreDestino = opciones.destinos.find((d) => d.id === form.id_destino)?.nombre;
  const nombreTipo = opciones.tipos.find((t) => t.id === form.tipo)?.nombre || "Cualquiera";
  const nombresPrefs = opciones.preferencias.filter((p) => form.preferencias.includes(p.id)).map((p) => p.nombre);
  const titulo = actual === "fecha" && pasadia ? "¿Qué día vas?" : TITULOS[actual];

  return (
    <View style={{ flex: 1 }}>
      <BarraProgreso fraccion={(paso + 1) / pasos.length} style={styles.progreso} rellenoStyle={styles.progresoLleno} />
      <ScrollView ref={scroll} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Entrada key={actual} direccion={direccion.current}>
          <Text style={styles.contador}>Paso {paso + 1} de {pasos.length}</Text>
          <Text style={styles.titulo}>{titulo}</Text>

          {actual === "destino" &&
            opciones.destinos.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => set("id_destino", d.id)}
                style={[styles.opcion, form.id_destino === d.id && styles.opcionActiva]}
              >
                <Text style={styles.opcionTitulo}>{d.nombre}</Text>
                <Text style={styles.opcionTexto}>{d.region} · {d.descripcion}</Text>
              </Pressable>
            ))}

          {actual === "tipo" && (
            <View style={styles.chips}>
              <Chip texto="Cualquiera" activo={!form.tipo} onPress={() => elegirTipo("")} />
              {opciones.tipos.map((t) => (
                <Chip key={t.id} texto={t.nombre} activo={form.tipo === t.id} onPress={() => elegirTipo(t.id)} />
              ))}
            </View>
          )}

          {actual === "personas" && (
            <View style={styles.stepper}>
              <Pressable style={styles.stepperBoton} onPress={() => set("personas", Math.max(1, form.personas - 1))} accessibilityLabel="Menos personas">
                <Text style={styles.stepperSigno}>−</Text>
              </Pressable>
              <Text style={styles.stepperValor}>{form.personas}</Text>
              <Pressable style={styles.stepperBoton} onPress={() => set("personas", Math.min(30, form.personas + 1))} accessibilityLabel="Más personas">
                <Text style={styles.stepperSigno}>+</Text>
              </Pressable>
            </View>
          )}

          {actual === "fecha" && pasadia && <Calendario valor={form.fecha_viaje} onChange={(f) => set("fecha_viaje", f)} />}

          {actual === "fecha" && !pasadia && (
            <>
              <Text style={styles.ayuda}>
                {finObligatorio ? "Elige el día de inicio y el día de fin." : "Elige el día de inicio y, si ya lo sabes, el de fin."}
              </Text>
              <View style={styles.rango}>
                <View style={[styles.rangoCaja, !form.fecha_viaje && styles.rangoCajaActiva]}>
                  <Text style={styles.filaEtiqueta}>Inicio</Text>
                  <Text style={styles.filaValor}>{form.fecha_viaje ? fechaCorta(form.fecha_viaje) : "Elige fecha"}</Text>
                </View>
                <View style={[styles.rangoCaja, form.fecha_viaje && !form.fecha_regreso && styles.rangoCajaActiva]}>
                  <Text style={styles.filaEtiqueta}>Fin</Text>
                  <Text style={styles.filaValor}>{form.fecha_regreso ? fechaCorta(form.fecha_regreso) : "Elige fecha"}</Text>
                </View>
              </View>
              <Calendario
                rango
                valor={{ inicio: form.fecha_viaje, fin: form.fecha_regreso }}
                onChange={({ inicio, fin }) => setForm((f) => ({ ...f, fecha_viaje: inicio, fecha_regreso: fin }))}
              />
              {form.fecha_regreso && (
                <Text style={[styles.ayuda, { marginTop: 12 }]}>
                  {diasEntre(form.fecha_viaje, form.fecha_regreso)} {diasEntre(form.fecha_viaje, form.fecha_regreso) === 1 ? "día" : "días"} de viaje
                </Text>
              )}
            </>
          )}

          {actual === "preferencias" && (
            <>
              <Text style={styles.ayuda}>Elige las que quieras, o ninguna.</Text>
              <View style={styles.chips}>
                {opciones.preferencias.map((p) => {
                  const activo = form.preferencias.includes(p.id);
                  return (
                    <Chip
                      key={p.id}
                      texto={p.nombre}
                      activo={activo}
                      onPress={() =>
                        set("preferencias", activo ? form.preferencias.filter((x) => x !== p.id) : [...form.preferencias, p.id])
                      }
                    />
                  );
                })}
              </View>
            </>
          )}

          {actual === "presupuesto" && (
            <>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="$0"
                value={form.presupuesto ? cop(form.presupuesto) : ""}
                onChangeText={(t) => set("presupuesto", t.replace(/\D/g, ""))}
                accessibilityLabel="Presupuesto total en pesos"
              />
              <Text style={styles.ayuda}>
                Para {form.personas} {form.personas === 1 ? "persona" : "personas"}
                {Number(form.presupuesto) > 0 ? `, unos ${cop(form.presupuesto / form.personas)} por persona.` : "."}
              </Text>
              <View style={styles.chips}>
                {PRESUPUESTOS_RAPIDOS.map((v) => (
                  <Chip key={v} texto={cop(v)} activo={Number(form.presupuesto) === v} onPress={() => set("presupuesto", String(v))} />
                ))}
              </View>
            </>
          )}

          {actual === "resumen" && (
            <View style={styles.resumen}>
              {modo === "destino" && <Fila etiqueta="Destino" valor={nombreDestino} />}
              <Fila etiqueta="Tipo de plan" valor={nombreTipo} />
              <Fila etiqueta="Personas" valor={String(form.personas)} />
              <Fila etiqueta={form.fecha_regreso && !pasadia ? "Fechas" : "Fecha"} valor={rangoCorto(form.fecha_viaje, !pasadia && form.fecha_regreso)} />
              <Fila etiqueta="Preferencias" valor={nombresPrefs.join(", ") || "Sin preferencias"} />
              <Fila etiqueta="Presupuesto total" valor={cop(form.presupuesto)} />
              {errorEnvio && <Text style={styles.error}>{errorEnvio}</Text>}
            </View>
          )}
        </Entrada>
      </ScrollView>

      <View style={styles.pie}>
        {paso > 0 && <Boton titulo="Atrás" variante="secundario" onPress={() => irA(paso - 1)} style={{ flex: 1, marginRight: 10 }} />}
        {actual === "resumen" ? (
          <Boton titulo="Buscar ofertas" onPress={buscar} cargando={enviando} style={{ flex: 2 }} />
        ) : (
          <Boton titulo="Siguiente" onPress={() => irA(paso + 1)} deshabilitado={!puedeSeguir} style={{ flex: 2 }} />
        )}
      </View>
    </View>
  );
}

function Fila({ etiqueta, valor }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
      <Text style={styles.filaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  progreso: { height: 4, backgroundColor: colors.borde },
  progresoLleno: { height: 4, backgroundColor: colors.tinta },
  contenido: { padding: 20, paddingBottom: 40 },
  contador: { color: colors.suave, fontFamily: fonts.medio },
  titulo: { fontSize: 26, fontFamily: fonts.titulo, color: colors.texto, marginTop: 4, marginBottom: 18 },
  opcion: { backgroundColor: colors.blanco, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: colors.borde },
  opcionActiva: { borderColor: colors.tinta, backgroundColor: colors.solClaro },
  opcionTitulo: { fontSize: 17, fontFamily: fonts.negrita, color: colors.texto },
  opcionTexto: { color: colors.suave, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap" },
  ayuda: { color: colors.suave, marginBottom: 12, marginTop: 4 },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 },
  stepperBoton: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.blanco, borderWidth: 1.5, borderColor: colors.tinta, alignItems: "center", justifyContent: "center" },
  stepperSigno: { fontSize: 28, color: colors.tinta, fontFamily: fonts.negrita },
  stepperValor: { fontSize: 44, fontFamily: fonts.titulo, color: colors.texto, marginHorizontal: 36, minWidth: 50, textAlign: "center" },
  input: { backgroundColor: colors.blanco, borderRadius: 14, borderWidth: 1.5, borderColor: colors.borde, fontSize: 28, fontFamily: fonts.negrita, padding: 16, color: colors.texto },
  resumen: { backgroundColor: colors.blanco, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.borde },
  fila: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.papel },
  filaEtiqueta: { color: colors.suave, fontSize: 13 },
  filaValor: { color: colors.texto, fontSize: 16, fontFamily: fonts.medio, marginTop: 2 },
  error: { color: colors.error, marginTop: 12, textAlign: "center" },
  rango: { flexDirection: "row", gap: 8, marginBottom: 12 },
  rangoCaja: { flex: 1, backgroundColor: colors.blanco, borderRadius: 12, borderWidth: 1.5, borderColor: colors.borde, padding: 12 },
  rangoCajaActiva: { borderColor: colors.tinta },
  pie: { flexDirection: "row", padding: 16, borderTopWidth: 1, borderTopColor: colors.borde, backgroundColor: colors.papel },
});
