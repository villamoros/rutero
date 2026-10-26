import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";
import { hoyISO, toISO } from "../lib/format";

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

// Calendario simple en JS puro: funciona igual en iOS, Android y web sin módulos nativos.
export default function Calendario({ valor, onChange }) {
  const hoy = hoyISO();
  const inicial = valor || hoy;
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
          const elegido = iso === valor;
          return (
            <Pressable
              key={iso}
              disabled={pasado}
              onPress={() => onChange(iso)}
              style={[styles.celda, elegido && styles.elegido]}
              accessibilityLabel={iso}
            >
              <Text style={[styles.dia, pasado && { opacity: 0.25 }, elegido && { color: colors.blanco }]}>{dia}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { backgroundColor: colors.blanco, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.borde },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingHorizontal: 8 },
  flecha: { fontSize: 30, color: colors.mar, paddingHorizontal: 8 },
  mes: { fontSize: 17, fontWeight: "700", color: colors.texto },
  grilla: { flexDirection: "row", flexWrap: "wrap" },
  celda: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 999 },
  diaSemana: { color: colors.suave, fontWeight: "700", textAlign: "center", textAlignVertical: "center", lineHeight: 40 },
  dia: { fontSize: 15, color: colors.texto },
  elegido: { backgroundColor: colors.coral },
});
