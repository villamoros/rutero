import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Calendario from "../components/Calendario";
import { Boton, Chip } from "../components/ui";
import { api } from "../lib/api";
import { useBusqueda } from "../lib/busqueda";
import { cop, fechaCorta } from "../lib/format";
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
  const [form, setForm] = useState({ id_destino: null, tipo: "", personas: 2, fecha_viaje: null, preferencias: [], presupuesto: "" });

  const cargar = () => {
    setErrorCarga(null);
    api.opciones().then(setOpciones).catch((e) => setErrorCarga(e.message));
  };
  useEffect(cargar, []);

  const actual = pasos[paso];
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const puedeSeguir = useMemo(() => {
    if (actual === "destino") return !!form.id_destino;
    if (actual === "fecha") return !!form.fecha_viaje;
    if (actual === "presupuesto") return Number(form.presupuesto) > 0;
    return true;
  }, [actual, form]);

  async function buscar() {
    setEnviando(true);
    setErrorEnvio(null);
    const solicitud = {
      modo,
      id_destino: modo === "destino" ? form.id_destino : undefined,
      tipo: form.tipo || undefined,
      personas: form.personas,
      fecha_viaje: form.fecha_viaje,
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.progreso}>
        <View style={[styles.progresoLleno, { width: `${((paso + 1) / pasos.length) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.contador}>Paso {paso + 1} de {pasos.length}</Text>
        <Text style={styles.titulo}>{TITULOS[actual]}</Text>

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
            <Chip texto="Cualquiera" activo={!form.tipo} onPress={() => set("tipo", "")} />
            {opciones.tipos.map((t) => (
              <Chip key={t.id} texto={t.nombre} activo={form.tipo === t.id} onPress={() => set("tipo", t.id)} />
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

        {actual === "fecha" && <Calendario valor={form.fecha_viaje} onChange={(f) => set("fecha_viaje", f)} />}

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
            <Fila etiqueta="Fecha" valor={fechaCorta(form.fecha_viaje)} />
            <Fila etiqueta="Preferencias" valor={nombresPrefs.join(", ") || "Sin preferencias"} />
            <Fila etiqueta="Presupuesto total" valor={cop(form.presupuesto)} />
            {errorEnvio && <Text style={styles.error}>{errorEnvio}</Text>}
          </View>
        )}
      </ScrollView>

      <View style={styles.pie}>
        {paso > 0 && <Boton titulo="Atrás" variante="secundario" onPress={() => setPaso(paso - 1)} style={{ flex: 1, marginRight: 10 }} />}
        {actual === "resumen" ? (
          <Boton titulo="Buscar ofertas" onPress={buscar} cargando={enviando} style={{ flex: 2 }} />
        ) : (
          <Boton titulo="Siguiente" onPress={() => setPaso(paso + 1)} deshabilitado={!puedeSeguir} style={{ flex: 2 }} />
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
  pie: { flexDirection: "row", padding: 16, borderTopWidth: 1, borderTopColor: colors.borde, backgroundColor: colors.papel },
});
