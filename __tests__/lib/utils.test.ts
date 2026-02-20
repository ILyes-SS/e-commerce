import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should handle undefined and null values", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("should resolve Tailwind conflicts (last wins)", () => {
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("should merge complex Tailwind classes", () => {
    const result = cn("text-red-500 bg-blue-500", "text-green-500");
    expect(result).toContain("text-green-500");
    expect(result).toContain("bg-blue-500");
    expect(result).not.toContain("text-red-500");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("should handle array inputs via clsx", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
