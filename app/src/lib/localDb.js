// Shim → re-export from new SQLite-based DB layer (src/lib/db/)
import { exportDb as __exportDb, importDb as __importDb } from "@/lib/db/index.js";

export async function selectiveImportDb(payload, sectionModes) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid database payload");
  }
  if (!sectionModes || typeof sectionModes !== "object" || Array.isArray(sectionModes)) {
    throw new Error("Invalid import modes");
  }

  const current = await __exportDb();
  const next = { ...current };

  for (const key of ["providerConnections", "providerNodes"]) {
    const mode = sectionModes[key] || "skip";
    if (mode === "skip") continue;
    const imported = Array.isArray(payload[key]) ? payload[key] : [];
    if (mode === "overwrite") next[key] = imported;
    if (mode === "merge") {
      const byId = new Map();
      const idless = [];
      for (const item of Array.isArray(next[key]) ? next[key] : []) {
        if (item?.id != null) byId.set(item.id, item);
        else idless.push(item);
      }
      for (const item of imported) {
        if (item?.id != null) byId.set(item.id, item);
        else idless.push(item);
      }
      next[key] = [...byId.values(), ...idless];
    }
  }

  for (const key of ["proxyPools", "customModels", "combos", "apiKeys"]) {
    if ((sectionModes[key] || "skip") === "overwrite" && Array.isArray(payload[key])) {
      next[key] = payload[key];
    }
  }

  for (const key of ["modelAliases", "mitmAlias", "pricing", "settings"]) {
    if ((sectionModes[key] || "skip") === "overwrite" && payload[key] && typeof payload[key] === "object" && !Array.isArray(payload[key])) {
      next[key] = payload[key];
    }
  }

  return __importDb(next);
}
// Kept for backward compatibility with existing imports.
export {
  getSettings, updateSettings, isCloudEnabled, getCloudUrl,
  getProviderConnections, getProviderConnectionById,
  createProviderConnection, updateProviderConnection,
  deleteProviderConnection, deleteProviderConnectionsByProvider,
  reorderProviderConnections, cleanupProviderConnections,
  getProviderNodes, getProviderNodeById,
  createProviderNode, updateProviderNode, deleteProviderNode,
  getProxyPools, getProxyPoolById,
  createProxyPool, updateProxyPool, deleteProxyPool,
  getApiKeys, getApiKeyById, createApiKey, updateApiKey, deleteApiKey, validateApiKey,
  getCombos, getComboById, getComboByName,
  createCombo, updateCombo, deleteCombo,
  getModelAliases, setModelAlias, deleteModelAlias,
  getCustomModels, addCustomModel, deleteCustomModel,
  getMitmAlias, setMitmAliasAll,
  getPricing, getPricingForModel, updatePricing, resetPricing, resetAllPricing,
  exportDb, importDb,
} from "@/lib/db/index.js";
