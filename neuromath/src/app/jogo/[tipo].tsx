import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Jogo() {
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Atividade: {tipo}
      </Text>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ backgroundColor: "#6366F1", padding: 16, borderRadius: 12 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
