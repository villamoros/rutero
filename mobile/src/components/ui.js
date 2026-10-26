import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";

export function Boton({ titulo, onPress, variante = "primario", deshabilitado, cargando, style }) {
  const secundario = variante === "secundario";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={deshabilitado || cargando}
      style={({ pressed }) => [
        styles.boton,
        secundario && styles.botonSecundario,
        (deshabilitado || cargando) && styles.botonDeshabilitado,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={secundario ? colors.mar : colors.blanco} />
      ) : (
        <Text style={[styles.botonTexto, secundario && { color: colors.mar }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

export function Chip({ texto, activo, onPress }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!activo }}
      onPress={onPress}
      style={[styles.chip, activo && styles.chipActivo]}
    >
      <Text style={[styles.chipTexto, activo && { color: colors.blanco }]}>{texto}</Text>
    </Pressable>
  );
}

export function Etiqueta({ texto, color = colors.marClaro }) {
  return (
    <View style={[styles.etiqueta, { backgroundColor: color }]}>
      <Text style={styles.etiquetaTexto}>{texto}</Text>
    </View>
  );
}

export function Tarjeta({ children, style }) {
  return <View style={[styles.tarjeta, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: colors.mar,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  botonSecundario: { backgroundColor: colors.blanco, borderWidth: 1.5, borderColor: colors.mar },
  botonDeshabilitado: { opacity: 0.45 },
  botonTexto: { color: colors.blanco, fontSize: 16, fontWeight: "700" },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActivo: { backgroundColor: colors.marClaro, borderColor: colors.marClaro },
  chipTexto: { color: colors.texto, fontWeight: "600" },
  etiqueta: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  etiquetaTexto: { color: colors.blanco, fontSize: 12, fontWeight: "700" },
  tarjeta: {
    backgroundColor: colors.blanco,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borde,
  },
});
