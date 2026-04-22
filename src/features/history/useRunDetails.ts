import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { getRunById, deleteRun } from "@/services/storageService";
import { formatDistance } from "@/utils/formatters";
import { Run } from "@/types";

export type UseRunDetailsReturn = {
  run: Run | null;
  loading: boolean;
  handleDelete: () => void;
};

export function useRunDetails(id: string | undefined): UseRunDetailsReturn {
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRunById(id)
        .then(setRun)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = useCallback(() => {
    if (!run) return;
    Alert.alert(
      "Usuń bieg",
      `Czy na pewno chcesz usunąć ten bieg (${formatDistance(run.distance)})?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            await deleteRun(run.id);
            router.back();
          },
        },
      ]
    );
  }, [run, router]);

  return { run, loading, handleDelete };
}

