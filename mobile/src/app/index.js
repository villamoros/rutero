import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Boton } from "../components/ui";
import { colors } from "../lib/theme";

export default function Inicio() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.hero}>
        <Text style={styles.logo}>Rutero</Text>
        <Text style={styles.titulo}>Pasadías, tours y paquetes en el Pacífico colombiano</Text>
        <Text style={styles.subtitulo}>
          Cuéntanos cómo quieres viajar y te mostramos las ofertas que encajan contigo.
        </Text>
      </View>
      <View style={styles.acciones}>
        <Boton titulo="Tengo un destino" onPress={() => router.push({ pathname: "/formulario", params: { modo: "destino" } })} />
        <Boton
          titulo="Tengo un presupuesto"
          variante="secundario"
          style={{ marginTop: 12 }}
          onPress={() => router.push({ pathname: "/formulario", params: { modo: "presupuesto" } })}
        />
        <Text style={styles.nota}>Turismo con comunidades locales · Nuquí · Bahía Solano · Gorgona y más</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.mar, justifyContent: "space-between" },
  hero: { padding: 28, paddingTop: 64 },
  logo: { color: colors.coral, fontSize: 18, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
  titulo: { color: colors.blanco, fontSize: 34, fontWeight: "800", marginTop: 16, lineHeight: 40 },
  subtitulo: { color: "#CFE5E2", fontSize: 17, marginTop: 16, lineHeight: 24 },
  acciones: { backgroundColor: colors.arena, padding: 24, paddingBottom: 36, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  nota: { color: colors.suave, textAlign: "center", marginTop: 18, fontSize: 13 },
});
