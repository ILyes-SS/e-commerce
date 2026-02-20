import { describe, it, expect, vi } from "vitest";

describe("robots", () => {
  it("should return correct robots config with default URL", async () => {
    // Reset module to ensure clean import
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const { default: robots } = await import("@/app/robots");
    const result = robots();

    expect(result.rules).toEqual([
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/checkout",
          "/protected",
          "/auth",
          "/dashboard",
          "/products-management",
          "/orders",
          "/stock",
        ],
      },
    ]);

    expect(result.sitemap).toBe("http://localhost:3000/sitemap.xml");
  });

  it("should use NEXT_PUBLIC_SITE_URL env variable for sitemap", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SITE_URL = "https://mystore.com";

    const { default: robots } = await import("@/app/robots");
    const result = robots();

    expect(result.sitemap).toBe("https://mystore.com/sitemap.xml");

    // Cleanup
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("should disallow admin and auth routes", async () => {
    vi.resetModules();

    const { default: robots } = await import("@/app/robots");
    const result = robots();
    const disallowed = result.rules[0].disallow;

    expect(disallowed).toContain("/auth");
    expect(disallowed).toContain("/dashboard");
    expect(disallowed).toContain("/products-management");
    expect(disallowed).toContain("/orders");
    expect(disallowed).toContain("/stock");
  });
});
