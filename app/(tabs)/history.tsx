import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllRuns } from "../../src/services/storageService";
import {
  formatDistance,
  formatTime,
  formatPace,
  calculatePace,
} from "../../src/features/run/distance";
import { Run } from "../../src/types";

export default function HistoryScreen() {
  const router = useRouter();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRuns = useCallback(() => {
    getAllRuns()
      .then(setRuns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Odświeżaj listę za każdym razem gdy ekran jest aktywny
  useFocusEffect(
    useCallback(() => {
      refreshRuns();
    }, [refreshRuns])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  }

  if (runs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🏁</Text>
        <Text style={styles.emptyText}>Brak zapisanych biegów</Text>
        <Text style={styles.emptyHint}>
          Ukończ swój pierwszy bieg, aby zobaczyć go tutaj!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={runs}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const pace = calculatePace(item.distance, item.duration * 1000);
        const date = new Date(item.startedAt);
        const dateStr = date.toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const timeStr = date.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/run/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{dateStr}</Text>
              <Text style={styles.cardTime}>{timeStr}</Text>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>
                  {formatDistance(item.distance)}
                </Text>
                <Text style={styles.cardStatLabel}>Dystans</Text>
              </View>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>
                  {formatTime(item.duration * 1000)}
                </Text>
                <Text style={styles.cardStatLabel}>Czas</Text>
              </View>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>
                  {formatPace(pace)} /km
                </Text>
                <Text style={styles.cardStatLabel}>Tempo</Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
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
  list: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  cardTime: {
    fontSize: 14,
    color: "#8E8E93",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardStat: {
    alignItems: "center",
  },
  cardStatValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  cardStatLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
    textTransform: "uppercase",
  },
  cardArrow: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 22,
    color: "#C7C7CC",
  },
});
