import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Boton, Etiqueta, Tarjeta } from "../../components/ui";
import { api } from "../../lib/api";
import { useBusqueda } from "../../lib/busqueda";
import { cop, fechaCorta } from "../../lib/format";
import { colors, TIPO_NOMBRE } from "../../lib/theme";

export default function DetallePaquete() {
  const { id } = useLocalSearchParams();
  const { busqueda } = useBusqueda();
  const solicitud = busqueda?.solicitud;

  const [paquete, setPaquete] = useState(null);
  const [error, setError] = useState(null);
  const [contacto, setContacto] = useState({ nombre: "", email: "", telefono: "" });
  const [enviando, setEnviando] = useState(false);
  const [reserva, setReserva] = useState(null);

  useEffect(() => {
    api.paquete(id).then(setPaquete).catch((e) => setError(e.message));
  }, [id]);

  async function reservar() {
    setEnviando(true);
    setError(null);
    try {
      const r = await api.reservar({
        id_paquete: paquete.id,
        id_solicitud: busqueda?.solicitud?.id,
        personas: solicitud?.personas || 1,
        fecha_viaje: solicitud?.fecha_viaje,
        ...contacto,
      });
      setReserva(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (!paquete) {
    return (
      <View style={styles.centro}>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator color={colors.mar} size="large" />}
      </View>
    );
  }

  if (reserva) {
    return (
      <View style={styles.centro}>
        <Text style={styles.listo}>¡Solicitud enviada!</Text>
        <Text style={styles.texto}>
          Tu reserva #{reserva.reserva.id} de {paquete.nombre} quedó pendiente por {cop(reserva.total)}.
          {"\n"}{paquete.proveedor.nombre} te contactará para confirmar y coordinar el pago.
        </Text>
        <Boton titulo="Volver al inicio" onPress={() => router.dismissAll()} style={{ marginTop: 20, alignSelf: "stretch" }} />
      </View>
    );
  }

  const personas = solicitud?.personas || 1;
  const contactoValido = contacto.nombre.trim() && /\S+@\S+\.\S+/.test(contacto.email);

  return (
    <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
      <Etiqueta texto={TIPO_NOMBRE[paquete.tipo]} />
      <Text style={styles.nombre}>{paquete.nombre}</Text>
      <Text style={styles.detalle}>
        {paquete.destino.nombre}, {paquete.destino.region} · {paquete.duracion_dias} {paquete.duracion_dias === 1 ? "día" : "días"} · ★ {Number(paquete.calificacion).toFixed(1)}
      </Text>
      <Text style={styles.texto}>{paquete.descripcion}</Text>

      <Tarjeta style={{ marginTop: 16 }}>
        <Text style={styles.seccion}>Qué incluye</Text>
        {paquete.servicios.map((s) => (
          <View key={s.id} style={styles.servicio}>
            <Text style={styles.servicioNombre}>{s.nombre}</Text>
            <Text style={styles.servicioCategoria}>{s.categoria?.nombre} · {s.descripcion}</Text>
          </View>
        ))}
      </Tarjeta>

      <Tarjeta>
        <Text style={styles.seccion}>Precio</Text>
        <Text style={styles.total}>{cop(paquete.precio * personas)}</Text>
        <Text style={styles.servicioCategoria}>
          {cop(paquete.precio)} por persona × {personas}
          {solicitud?.fecha_viaje ? ` · salida ${fechaCorta(solicitud.fecha_viaje)}` : ""}
        </Text>
        <Text style={[styles.servicioCategoria, { marginTop: 6 }]}>Disponible del {fechaCorta(paquete.fecha_inicio)} al {fechaCorta(paquete.fecha_fin)}</Text>
      </Tarjeta>

      <Tarjeta>
        <Text style={styles.seccion}>Reservar ahora</Text>
        <TextInput style={styles.input} placeholder="Nombre completo" value={contacto.nombre} onChangeText={(t) => setContacto({ ...contacto, nombre: t })} />
        <TextInput style={styles.input} placeholder="Correo" keyboardType="email-address" autoCapitalize="none" value={contacto.email} onChangeText={(t) => setContacto({ ...contacto, email: t })} />
        <TextInput style={styles.input} placeholder="Teléfono (opcional)" keyboardType="phone-pad" value={contacto.telefono} onChangeText={(t) => setContacto({ ...contacto, telefono: t })} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Boton titulo="Solicitar reserva" onPress={reservar} cargando={enviando} deshabilitado={!contactoValido || !solicitud} style={{ marginTop: 8 }} />
        <Text style={[styles.servicioCategoria, { marginTop: 8 }]}>No se cobra nada todavía. Operado por {paquete.proveedor.nombre}.</Text>
      </Tarjeta>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  contenido: { padding: 20, paddingBottom: 40 },
  nombre: { fontSize: 26, fontWeight: "800", color: colors.texto, marginTop: 10 },
  detalle: { color: colors.suave, marginTop: 4 },
  texto: { color: colors.texto, fontSize: 16, lineHeight: 23, marginTop: 12, textAlign: "left" },
  seccion: { fontSize: 17, fontWeight: "800", color: colors.texto, marginBottom: 8 },
  servicio: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.arena },
  servicioNombre: { fontWeight: "700", color: colors.texto },
  servicioCategoria: { color: colors.suave, marginTop: 2 },
  total: { fontSize: 26, fontWeight: "800", color: colors.mar },
  input: { borderWidth: 1.5, borderColor: colors.borde, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 10, backgroundColor: colors.blanco },
  error: { color: colors.error, marginVertical: 6 },
  listo: { fontSize: 26, fontWeight: "800", color: colors.mar },
});
