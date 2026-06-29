// Shim → re-export from new SQLite-based DB layer (src/lib/db/)
import { getUsageHistory as __getUsageHistory } from "@/lib/db/index.js";

export async function getUsageDb() {
  const history = await __getUsageHistory({});
  return {
    data: {
      history: history.map((entry) => ({
        ...entry,
        apiKey: entry.apiKey || entry.apiKeyMasked || "local-no-key",
      })),
      dailySummary: {},
    },
  };
}
export {
  statsEmitter, trackPendingRequest, getActiveRequests,
  saveRequestUsage, getUsageHistory, getUsageStats, getChartData,
  appendRequestLog, getRecentLogs,
  saveRequestDetail, getRequestDetails, getRequestDetailById,
} from "@/lib/db/index.js";
