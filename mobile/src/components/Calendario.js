import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../lib/theme";
import { hoyISO, toISO } from "../lib/format";

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

// Calendario simple en JS puro: funciona igual en iOS, Android y web sin módulos nativos.
// Sin `rango` se elige un día (valor = "AAAA-MM-DD").
// Con `rango` funciona como Booking o Airbnb: primer toque es el inicio, el segundo el fin
// (valor = { inicio, fin }); un tercer toque empieza un rango nuevo.
export default function Calendario({ valor, onChange, rango = false }) {
  const hoy = hoyISO();
  const inicio = rango ? valor?.inicio : valor;
  const fin = rango ? valor?.fin : null;
  const inicial = inicio || hoy;
  const [anio, setAnio] = useState(Number(inicial.slice(0, 4)));
  const [mes, setMes] = useState(Number(inicial.slice(5, 7)) - 1);

  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7; // lunes = 0
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  const celdas = [...Array(primerDia).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)];
  const esMesActual = toISO(anio, mes, 1) <= hoy.slice(0, 8) + "01";

  function mover(delta) {
    const d = new Date(anio, mes + delta, 1);
    setAnio(d.getFullYear());
    setMes(d.getMonth());
  }

  function elegir(iso) {
    if (!rango) return onChange(iso);
    if (!inicio || fin || iso < inicio) return onChange({ inicio: iso, fin: null });
    onChange({ inicio, fin: iso });
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Pressable onPress={() => mover(-1)} disabled={esMesActual} hitSlop={12} accessibilityLabel="Mes anterior">
          <Text style={[styles.flecha, esMesActual && { opacity: 0.25 }]}>‹</Text>
        </Pressable>
        <Text style={styles.mes}>{MESES[mes]} {anio}</Text>
        <Pressable onPress={() => mover(1)} hitSlop={12} accessibilityLabel="Mes siguiente">
          <Text style={styles.flecha}>›</Text>
        </Pressable>
      </View>
      <View style={styles.grilla}>
        {DIAS.map((d, i) => (
          <Text key={`d${i}`} style={[styles.celda, styles.diaSemana]}>{d}</Text>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <View key={`v${i}`} style={styles.celda} />;
          const iso = toISO(anio, mes, dia);
          const pasado = iso < hoy;
          const extremo = iso === inicio || iso === fin;
          const dentro = !!(fin && iso > inicio && iso < fin);
          return (
            <View key={iso} style={styles.celda}>
              {fin && fin !== inicio && (dentro || extremo) && (
                <View
                  style={[
                    styles.banda,
                    iso === inicio && { left: "50%" },
                    iso === fin && { right: "50%" },
                  ]}
                />
              )}
              <Pressable
                disabled={pasado}
                onPress={() => elegir(iso)}
                style={[styles.dia, extremo && styles.elegido]}
                accessibilityLabel={iso}
                accessibilityState={{ selected: extremo || dentro }}
              >
                <Text style={[styles.diaTexto, pasado && { opacity: 0.25 }, extremo && styles.elegidoTexto]}>{dia}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { backgroundColor: colors.blanco, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.borde },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingHorizontal: 8 },
  flecha: { fontSize: 30, color: colors.tinta, paddingHorizontal: 8 },
  mes: { fontSize: 17, fontFamily: fonts.negrita, color: colors.texto },
  grilla: { flexDirection: "row", flexWrap: "wrap" },
  celda: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  diaSemana: { color: colors.suave, fontFamily: fonts.negrita, textAlign: "center", textAlignVertical: "center", lineHeight: 40 },
  banda: { position: "absolute", top: "12%", bottom: "12%", left: 0, right: 0, backgroundColor: colors.solClaro },
  dia: { width: "76%", aspectRatio: 1, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  diaTexto: { fontSize: 15, color: colors.texto },
  elegido: { backgroundColor: colors.tinta },
  elegidoTexto: { color: colors.blanco, fontFamily: fonts.negrita },
});
