import { View, Text, StyleSheet } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.title}>Historia treningów</Text>
      <Text style={styles.subtitle}>Twoje biegi pojawią się tutaj</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🏁</Text>
        <Text style={styles.emptyText}>Brak zapisanych biegów</Text>
        <Text style={styles.emptyHint}>
          Ukończ swój pierwszy bieg, aby zobaczyć go tutaj!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    paddingTop: 40,
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});

