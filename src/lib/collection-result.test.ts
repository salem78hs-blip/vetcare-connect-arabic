import { describe, it as test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { collectionResult } from "./collection-result";

describe("collection reads", () => {
  test("an empty table is a successful empty collection", () => {
    deepStrictEqual(collectionResult({ status: "fulfilled", value: [] }), { items: [], failed: false });
  });
  test("a missing table keeps the screen usable and reports a failure", () => {
    deepStrictEqual(collectionResult({ status: "rejected", reason: new Error("missing table") }), { items: [], failed: true });
  });
  test("successful rows are retained", () => {
    deepStrictEqual(collectionResult({ status: "fulfilled", value: [{ id: "product-1" }] }), { items: [{ id: "product-1" }], failed: false });
  });
});