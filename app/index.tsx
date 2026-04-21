import { View, Text, StyleSheet, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useRunTracking } from "../src/features/run/useRunTracking";
import {
  calculateTotalDistance,
  calculatePace,
  formatDistance,
  formatPace,
  formatTime,
} from "../src/features/run/distance";
import StatsBar from "../src/components/StatsBar";

export default function RunScreen() {
  const { state, start, pause, resume, stop, reset } = useRunTracking();
  const { status, path, elapsedMs } = state;

  const lastCoord = path.length > 0 ? path[path.length - 1] : null;

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

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏃</Text>
      <Text style={styles.title}>Runly</Text>
      <Text style={styles.subtitle}>
        {status === "idle" && "Gotowy do biegu?"}
        {status === "running" && "Bieg w toku..."}
        {status === "paused" && "Pauza"}
        {status === "stopped" && "Bieg zakończony!"}
      </Text>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Debug GPS */}
      {lastCoord && (
        <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>📍 GPS debug</Text>
          <Text style={styles.debugText}>
            lat: {lastCoord.latitude.toFixed(6)}  lng: {lastCoord.longitude.toFixed(6)}
          </Text>
          <Text style={styles.debugText}>
            Punkty: {path.length}
          </Text>
        </View>
      )}

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
          <Pressable style={[styles.btn, styles.btnReset]} onPress={reset}>
            <Text style={styles.btnText}>🔄 NOWY BIEG</Text>
          </Pressable>
        )}
      </View>

      <StatusBar style="light" />
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
  debugBox: {
    width: "100%",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: "#1B5E20",
    fontFamily: "monospace",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
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
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
