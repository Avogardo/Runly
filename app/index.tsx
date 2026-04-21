import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RunScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏃</Text>
      <Text style={styles.title}>Runly</Text>
      <Text style={styles.subtitle}>Gotowy do biegu?</Text>
      <View style={styles.statsPlaceholder}>
        <StatItem label="Dystans" value="0.00 km" />
        <StatItem label="Czas" value="00:00" />
        <StatItem label="Tempo" value="--:-- /km" />
      </View>
      <View style={styles.buttonPlaceholder}>
        <Text style={styles.buttonText}>▶ START</Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 40,
  },
  statsPlaceholder: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  buttonPlaceholder: {
    backgroundColor: "#34C759",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

