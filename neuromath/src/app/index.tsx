import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useEstrelas } from "../context/EstrelasContext";

const CRIANCA_NOME = "User";

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

export default function Home() {
  const router = useRouter();
  const { estrelas } = useEstrelas();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      {/* Cabeçalho */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontSize: 48, marginBottom: 8 }}>🧮</Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#1A1A2E",
            textAlign: "center",
          }}
        >
          Olá, {CRIANCA_NOME}!
        </Text>
        <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 4 }}>
          Vamos praticar matemática hoje?
        </Text>
      </View>

      {/* Contador de estrelas */}
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
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#92400E" }}>
          {estrelas} estrelas conquistadas
        </Text>
        <Text style={{ fontSize: 20 }}>🏆</Text>
      </View>

      {/* Grid de atividades */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {ATIVIDADES.map((atividade) => (
          <Link
            key={atividade.tipo}
            href={{
              pathname: "/jogo/[tipo]",
              params: { tipo: atividade.tipo },
            }}
            asChild
          >
            <Pressable
              onPress={() => {
                console.log("🎮 ATIVIDADE SELECIONADA");
                console.log("📌 Tipo:", atividade.tipo);
                console.log("📖 Título:", atividade.titulo);
              }}
              style={{
                width: "47%",
                backgroundColor: atividade.bg,
                borderWidth: 2,
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
            </Pressable>
          </Link>
        ))}
      </View>

      {/* Rodapé */}
      <Text
        style={{
          textAlign: "center",
          color: "#9CA3AF",
          fontSize: 12,
          marginTop: 32,
        }}
      >
        🧩 Cada exercício no seu ritmo. Você consegue!
      </Text>
    </ScrollView>
  );
}
