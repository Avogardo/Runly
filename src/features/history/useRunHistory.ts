import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllRuns } from "@/services/storageService";
import { Run } from "@/types";

export type UseRunHistoryReturn = {
  runs: Run[];
  loading: boolean;
};

export function useRunHistory(): UseRunHistoryReturn {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRuns = useCallback(() => {
    getAllRuns()
      .then(setRuns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshRuns();
    }, [refreshRuns])
  );

  return { runs, loading };
}

