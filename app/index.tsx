import { View, Text, StyleSheet, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRunTracking } from "../src/features/run/useRunTracking";

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function RunScreen() {
  const { state, start, pause, resume, stop, reset } = useRunTracking();
  const { status, path, elapsedMs } = state;
console.log(path)
  const lastCoord = path.length > 0 ? path[path.length - 1] : null;

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
      <View style={styles.statsPlaceholder}>
        <StatItem label="Czas" value={formatTime(elapsedMs)} />
        <StatItem label="Punkty GPS" value={String(path.length)} />
      </View>

      {/* Debug GPS */}
      {lastCoord && (
        <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>📍 Ostatnia pozycja</Text>
          <Text style={styles.debugText}>
            lat: {lastCoord.latitude.toFixed(6)}
          </Text>
          <Text style={styles.debugText}>
            lng: {lastCoord.longitude.toFixed(6)}
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
    marginBottom: 20,
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
  debugBox: {
    width: "100%",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 13,
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
