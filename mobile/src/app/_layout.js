import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BusquedaProvider } from "../lib/busqueda";
import { colors } from "../lib/theme";

export default function Layout() {
  return (
    <BusquedaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.arena },
          headerTintColor: colors.mar,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.arena },
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
