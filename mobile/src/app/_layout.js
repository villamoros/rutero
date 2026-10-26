import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { Figtree_400Regular, Figtree_600SemiBold, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BusquedaProvider } from "../lib/busqueda";
import { colors, fonts } from "../lib/theme";

export default function Layout() {
  const [fuentesListas] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_800ExtraBold,
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  if (!fuentesListas) return null;

  return (
    <BusquedaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.papel },
          headerTintColor: colors.tinta,
          headerTitleStyle: { fontFamily: fonts.titulo },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.papel },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="formulario" options={{ title: "Arma tu viaje" }} />
        <Stack.Screen name="resultados" options={{ title: "Ofertas para ti" }} />
        <Stack.Screen name="paquete/[id]" options={{ title: "Detalle" }} />
      </Stack>
    </BusquedaProvider>
  );
}
