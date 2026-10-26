import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";

const DURACION = 320;
const DISTANCIA = 36;

// Hace entrar su contenido deslizándose desde la derecha (direccion 1) o la izquierda (-1).
// Se repite cada vez que el componente se monta, así que hay que darle un `key` por paso.
// En web se usa una animación CSS porque Animated de react-native-web no actualiza el DOM aquí.
// Las keyframes van en StyleSheet.create: react-native-web las ignora en estilos en línea.
export function Entrada({ direccion = 1, children }) {
  if (Platform.OS === "web") {
    return <View style={direccion < 0 ? estilosWeb.desdeIzquierda : estilosWeb.desdeDerecha}>{children}</View>;
  }
  return <EntradaNativa direccion={direccion}>{children}</EntradaNativa>;
}

function EntradaNativa({ direccion, children }) {
  const valor = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(valor, { toValue: 1, duration: DURACION, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [valor]);
  return (
    <Animated.View
      style={{
        opacity: valor,
        transform: [{ translateX: valor.interpolate({ inputRange: [0, 1], outputRange: [DISTANCIA * direccion, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

// Barra de progreso que avanza suavemente hasta `fraccion` (0 a 1).
export function BarraProgreso({ fraccion, style, rellenoStyle }) {
  const valor = useRef(new Animated.Value(fraccion)).current;
  useEffect(() => {
    if (Platform.OS === "web") return;
    Animated.timing(valor, { toValue: fraccion, duration: DURACION, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [fraccion, valor]);

  if (Platform.OS === "web") {
    return (
      <View style={style}>
        <View
          style={[
            rellenoStyle,
            { width: `${fraccion * 100}%`, transitionProperty: "width", transitionDuration: `${DURACION}ms`, transitionTimingFunction: "ease-out" },
          ]}
        />
      </View>
    );
  }
  return (
    <View style={style}>
      <Animated.View style={[rellenoStyle, { width: valor.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
    </View>
  );
}

const animacionWeb = (desde) => ({
  animationKeyframes: [
    {
      "0%": { opacity: 0, transform: `translateX(${desde}px)` },
      "100%": { opacity: 1, transform: "translateX(0px)" },
    },
  ],
  animationDuration: `${DURACION}ms`,
  animationTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  animationFillMode: "both",
});

const estilosWeb = StyleSheet.create({
  desdeDerecha: animacionWeb(DISTANCIA),
  desdeIzquierda: animacionWeb(-DISTANCIA),
});
