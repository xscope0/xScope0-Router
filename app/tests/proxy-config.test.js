import { describe, expect, test, vi } from "vitest";

vi.mock("@/models", () => ({
  getProxyPoolById: async (id) => {
    if (id !== "pool-1") return null;
    return {
      id,
      type: "http",
      proxyUrl: "http://first:8080",
      proxyUrls: ["http://first:8080", "http://second:8080"],
      noProxy: "localhost",
      isActive: true,
      strictProxy: true,
    };
  },
}));

describe("resolveConnectionProxyConfig", () => {
  test("returns pool proxy rotation list and strict mode", async () => {
    const { resolveConnectionProxyConfig } = await import("../src/lib/network/connectionProxy.js");

    const config = await resolveConnectionProxyConfig({ proxyPoolId: "pool-1" });

    expect(config.connectionProxyUrl).toBe("http://first:8080");
    expect(config.connectionProxyUrls).toEqual(["http://first:8080", "http://second:8080"]);
    expect(config.strictProxy).toBe(true);
  });
});
