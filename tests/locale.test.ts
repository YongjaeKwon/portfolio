import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("URL locale with unavailable storage", () => {
  it.each(["en", "ko"])("respects explicit %s despite storage failures", async (language) => {
    vi.resetModules();
    vi.stubGlobal("window", {
      location: { search: `?lang=${language}` },
      get localStorage() { throw new Error("storage unavailable"); },
    });
    expect((await import("../src/i18n/locale")).locale).toBe(language);
  });

  it("uses an explicit Korean URL when a stale English preference cannot be saved", async () => {
    const location = { search: "?lang=en", href: "https://example.test/?lang=en&focus=backend#projects" };
    vi.stubGlobal("window", {
      location,
      localStorage: { getItem: () => "en", setItem: () => { throw new Error("read only"); } },
    });
    const { switchLocale } = await import("../src/i18n/locale");
    switchLocale("ko");
    expect(location.href).toBe("https://example.test/?lang=ko&focus=backend#projects");
  });
});
