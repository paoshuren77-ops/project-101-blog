import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats an ISO date as zh-CN dotted date", () => {
    expect(formatDate("2026-04-21T08:30:00.000Z")).toBe("2026.04.21");
  });
});
