import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useMemo, useCallback, useState } from "react";
import { useRunTracking } from "../../src/features/run/useRunTracking";
import {
  calculateTotalDistance,
  calculatePace,
  formatDistance,
  formatPace,
  formatTime,
} from "../../src/features/run/distance";
import { saveRun, generateId } from "../../src/services/storageService";
import StatsBar from "../../src/components/StatsBar";
import RunMapView from "../../src/components/MapView";
import { Run } from "../../src/types";

export default function RunScreen() {
  const { state, start, pause, resume, stop, reset } = useRunTracking();
  const { status, path, elapsedMs } = state;

  const distance = useMemo(() => calculateTotalDistance(path), [path]);
  const pace = useMemo(
    () => calculatePace(distance, elapsedMs),
    [distance, elapsedMs]
  );

  const stats = useMemo(
    () => [
      { label: "Dystans", value: formatDistance(distance) },
      { label: "Czas", value: formatTime(elapsedMs) },
      { label: "Tempo", value: `${formatPace(pace)} /km` },
    ],
    [distance, elapsedMs, pace]
  );

  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    if (!state.startedAt || path.length === 0) {
      Alert.alert("Błąd", "Brak danych do zapisania.");
      return;
    }

    const run: Run = {
      id: generateId(),
      startedAt: state.startedAt,
      endedAt: new Date().toISOString(),
      distance,
      duration: Math.floor(elapsedMs / 1000),
      path,
    };

    try {
      await saveRun(run);
      setSaved(true);
      Alert.alert("✅ Zapisano!", `Bieg ${formatDistance(distance)} został zapisany.`);
    } catch (e: any) {
      Alert.alert("Błąd zapisu", e.message);
    }
  }, [state.startedAt, path, distance, elapsedMs]);

  const handleReset = useCallback(() => {
    reset();
    setSaved(false);
  }, [reset]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.emoji}>🏃</Text>
      <Text style={styles.title}>Runly</Text>
      <Text style={styles.subtitle}>
        {status === "idle" && "Gotowy do biegu?"}
        {status === "running" && "Bieg w toku..."}
        {status === "paused" && "Pauza"}
        {status === "stopped" && "Bieg zakończony!"}
      </Text>

      {/* Mapa */}
      <RunMapView
        path={path}
        followUser={status === "running"}
        staticMode={status === "stopped"}
      />

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        {status === "idle" && (
          <Pressable style={[styles.btn, styles.btnStart]} onPress={start}>
            <Text style={styles.btnText}>▶ START</Text>
          </Pressable>
        )}

        {status === "running" && (
          <>
            <Pressable style={[styles.btn, styles.btnPause]} onPress={pause}>
              <Text style={styles.btnText}>⏸ PAUZA</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnStop]} onPress={stop}>
              <Text style={styles.btnText}>⏹ STOP</Text>
            </Pressable>
          </>
        )}

        {status === "paused" && (
          <>
            <Pressable style={[styles.btn, styles.btnStart]} onPress={resume}>
              <Text style={styles.btnText}>▶ WZNÓW</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnStop]} onPress={stop}>
              <Text style={styles.btnText}>⏹ STOP</Text>
            </Pressable>
          </>
        )}

        {status === "stopped" && (
          <>
            {!saved && (
              <Pressable style={[styles.btn, styles.btnSave]} onPress={handleSave}>
                <Text style={styles.btnText}>💾 ZAPISZ</Text>
              </Pressable>
            )}
            <Pressable style={[styles.btn, styles.btnReset]} onPress={handleReset}>
              <Text style={styles.btnText}>🔄 NOWY BIEG</Text>
            </Pressable>
          </>
        )}
      </View>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  container: {
    alignItems: "center",
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnStart: {
    backgroundColor: "#34C759",
    shadowColor: "#34C759",
  },
  btnPause: {
    backgroundColor: "#FF9500",
    shadowColor: "#FF9500",
  },
  btnStop: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
  btnReset: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  btnSave: {
    backgroundColor: "#34C759",
    shadowColor: "#34C759",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
