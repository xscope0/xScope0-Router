import { describe, expect, test, vi } from "vitest";

vi.mock("@/models", () => ({
  getProxyPoolById: async (id) => ({
    id,
    type: "http",
    proxyUrl: "http://first:8080",
    proxyUrls: ["http://first:8080", "http://second:8080"],
    noProxy: "localhost",
    isActive: true,
    strictProxy: true,
  }),
}));

vi.mock("@/lib/localDb", () => ({
  getProviderConnections: async () => [{
    id: "conn-1",
    provider: "openai",
    isActive: true,
    authType: "api_key",
    apiKey: "sk-test",
    name: "OpenAI",
    providerSpecificData: { proxyPoolId: "pool-1" },
    testStatus: "active",
  }],
  validateApiKey: async () => null,
  updateProviderConnection: async () => undefined,
  getSettings: async () => ({}),
  updateSettings: async () => undefined,
  getProviderNodeById: async () => null,
  getProxyPools: async () => [],
}));

vi.mock("../src/sse/utils/logger.js", () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}));

describe("getProviderCredentials", () => {
  test("returns resolved proxy list and strict mode", async () => {
    const { getProviderCredentials } = await import("../src/sse/services/auth.js");

    const credentials = await getProviderCredentials("openai");

    expect(credentials.providerSpecificData.connectionProxyUrl).toBe("http://first:8080");
    expect(credentials.providerSpecificData.connectionProxyUrls).toEqual(["http://first:8080", "http://second:8080"]);
    expect(credentials.providerSpecificData.strictProxy).toBe(true);
  });
});
