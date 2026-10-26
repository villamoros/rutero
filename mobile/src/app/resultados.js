import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Boton, Etiqueta, Tarjeta } from "../components/ui";
import { useBusqueda } from "../lib/busqueda";
import { cop, fechaCorta } from "../lib/format";
import { colors, TIPO_NOMBRE } from "../lib/theme";

export default function Resultados() {
  const { busqueda } = useBusqueda();

  if (!busqueda) {
    return (
      <View style={styles.centro}>
        <Text style={styles.vacio}>Aún no has hecho una búsqueda.</Text>
        <Boton titulo="Empezar" onPress={() => router.replace("/")} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const { solicitud, resultados, alternativas } = busqueda;
  const hayResultados = resultados.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <Text style={styles.resumen}>
        {solicitud.personas} {solicitud.personas === 1 ? "persona" : "personas"} · {fechaCorta(solicitud.fecha_viaje)} · hasta {cop(solicitud.presupuesto)}
      </Text>

      {hayResultados ? (
        <Text style={styles.titulo}>Encontramos {resultados.length} {resultados.length === 1 ? "oferta" : "ofertas"}</Text>
      ) : (
        <>
          <Text style={styles.titulo}>No hay ofertas exactas</Text>
          <Text style={styles.ayuda}>
            {alternativas.length
              ? "Estas se acercan a lo que buscas, en otras fechas o un poco por encima del presupuesto."
              : "Prueba con otra fecha, más presupuesto o sin filtrar por tipo de plan."}
          </Text>
        </>
      )}

      {(hayResultados ? resultados : alternativas).map((o) => (
        <Pressable key={o.id} onPress={() => router.push(`/paquete/${o.id}`)}>
          <Tarjeta>
            <View style={styles.cabecera}>
              <Etiqueta texto={TIPO_NOMBRE[o.tipo]} />
              <Text style={styles.puntaje}>{o.puntaje}% para ti</Text>
            </View>
            <Text style={styles.nombre}>{o.nombre}</Text>
            <Text style={styles.detalle}>
              {o.destino} · {o.duracion_dias} {o.duracion_dias === 1 ? "día" : "días"} · ★ {o.calificacion.toFixed(1)}
            </Text>
            <View style={styles.precios}>
              <Text style={styles.total}>{cop(o.total)}</Text>
              <Text style={styles.porPersona}>{cop(o.precio_persona)} por persona</Text>
            </View>
            {o.razones.map((r) => (
              <Text key={r} style={styles.razon}>• {r}</Text>
            ))}
            <Text style={styles.proveedor}>Con {o.proveedor}</Text>
          </Tarjeta>
        </Pressable>
      ))}

      <Boton titulo="Nueva búsqueda" variante="secundario" onPress={() => router.dismissAll()} style={{ marginTop: 6 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  vacio: { fontSize: 16, color: colors.suave },
  contenido: { padding: 20, paddingBottom: 40 },
  resumen: { color: colors.suave, fontWeight: "600" },
  titulo: { fontSize: 24, fontWeight: "800", color: colors.texto, marginTop: 4, marginBottom: 14 },
  ayuda: { color: colors.suave, marginTop: -6, marginBottom: 14, lineHeight: 20 },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  puntaje: { color: colors.coral, fontWeight: "800" },
  nombre: { fontSize: 19, fontWeight: "800", color: colors.texto, marginTop: 10 },
  detalle: { color: colors.suave, marginTop: 4 },
  precios: { flexDirection: "row", alignItems: "baseline", marginTop: 10, marginBottom: 6, flexWrap: "wrap" },
  total: { fontSize: 22, fontWeight: "800", color: colors.mar, marginRight: 8 },
  porPersona: { color: colors.suave },
  razon: { color: colors.texto, marginTop: 3 },
  proveedor: { color: colors.suave, marginTop: 10, fontSize: 13 },
});
