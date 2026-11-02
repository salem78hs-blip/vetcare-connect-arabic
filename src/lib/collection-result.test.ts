import { describe, expect, test } from "bun:test";
import { collectionResult } from "./collection-result";

describe("collection reads", () => {
  test("an empty table is a successful empty collection", () => {
    expect(collectionResult({ status: "fulfilled", value: [] })).toEqual({ items: [], failed: false });
  });
  test("a missing table keeps the screen usable and reports a failure", () => {
    expect(collectionResult({ status: "rejected", reason: new Error("missing table") })).toEqual({ items: [], failed: true });
  });
  test("successful rows are retained", () => {
    expect(collectionResult({ status: "fulfilled", value: [{ id: "product-1" }] })).toEqual({ items: [{ id: "product-1" }], failed: false });
  });
});