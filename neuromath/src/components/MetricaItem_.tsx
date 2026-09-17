import { StyleSheet, Text, View } from "react-native";

interface MetricaItemProps {
  label: string;
  valor: string;
  cor: string;
}

export function MetricaItem({ label, valor, cor }: MetricaItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text
        style={[
          styles.valor,
          {
            color: cor,
          },
        ]}
      >
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
  },

  valor: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
