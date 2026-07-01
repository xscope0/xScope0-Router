import { describe, expect, test, vi } from "vitest";

vi.mock("undici", () => ({
  ProxyAgent: class ProxyAgent {
    constructor(options) {
      this.options = options;
    }
  },
}));

describe("proxyAwareFetch", () => {
  test("falls back to direct after all proxies return retryable responses", async () => {
    vi.resetModules();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("proxy one limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("proxy two failed", { status: 502 }))
      .mockResolvedValueOnce(new Response("direct ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const { proxyAwareFetch } = await import("../open-sse/utils/proxyFetch.js");

    const response = await proxyAwareFetch("https://example.com/v1/chat", {}, {
      connectionProxyEnabled: true,
      connectionProxyUrls: ["http://proxy-one:8080", "http://proxy-two:8080"],
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("direct ok");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][1].dispatcher).toBeTruthy();
    expect(fetchMock.mock.calls[1][1].dispatcher).toBeTruthy();
    expect(fetchMock.mock.calls[2][1]).toEqual({});
  });
});
