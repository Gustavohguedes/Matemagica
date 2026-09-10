import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USER = "user";
const TOTAL_STARS = 1;

const ATIVIDADES = [
  {
    tipo: "contagem",
    titulo: "Contagem",
    descricao: "Aprenda a contar objetos de forma divertida",
    emoji: "🔢",
    bg: "#E8E4FF",
    border: "#C4B8FF",
  },
  {
    tipo: "adicao",
    titulo: "Adição",
    descricao: "Some números com ajuda visual",
    emoji: "➕",
    bg: "#D6F5EC",
    border: "#A8E6CF",
  },
  {
    tipo: "subtracao",
    titulo: "Subtração",
    descricao: "Tire e descubra quanto fica",
    emoji: "➖",
    bg: "#FFE4E4",
    border: "#FFBCBC",
  },
  {
    tipo: "sequencia",
    titulo: "Sequência",
    descricao: "Complete a sequência de números",
    emoji: "🔗",
    bg: "#FFF8DC",
    border: "#FFE08A",
  },
];

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontSize: 48, marginBottom: 8 }}>🧮</Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1A1A2E",
            textAlign: "center",
          }}
        >
          Bem-vindo ao neuroMath, {USER}!
        </Text>
        <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 4 }}>
          Vamos praticar Matemática hoje ?
        </Text>
      </View>

      {/* Star counter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFBEB",
          borderWidth: 2,
          borderColor: "#FCD34D",
          borderRadius: 50,
          paddingHorizontal: 20,
          paddingVertical: 10,
          alignSelf: "center",
          marginBottom: 32,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 20 }}>⭐</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#92300E" }}>
          {TOTAL_STARS} estrelas conquistadas
        </Text>
        <Text style={{ fontSize: 20 }}>🏆</Text>
      </View>

      {/* Activities grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {ATIVIDADES.map((atividade) => (
          <TouchableOpacity
            key={atividade.tipo}
            onPress={() =>
              router.push({
                pathname: "/jogo/[tipo]",
                params: { tipo: atividade.tipo },
              })
            }
            activeOpacity={0.85}
            style={{
              width: "47%",
              backgroundColor: atividade.bg,
              borderColor: atividade.border,
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
              minHeight: 160,
              justifyContent: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: atividade.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 32 }}>{atividade.emoji}</Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#1A1A2E",
                textAlign: "center",
              }}
            >
              {atividade.titulo}
            </Text>
            <Text
              style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}
            >
              {atividade.descricao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* footer */}
      <Text
        style={{
          textAlign: "center",
          color: "#9CA3AF",
          fontSize: 12,
          marginTop: 32,
        }}
      >
        🌈 Cada exercício no seu ritmo. Você consegue!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
