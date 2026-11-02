import { describe, it } from "node:test";
import { throws, doesNotThrow } from "node:assert";
import { validateProductImage } from "./product-image";

describe("product image validation", () => {
  it("accepts supported images up to 5 MB", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"])
      doesNotThrow(() => validateProductImage({ type, size: 5 * 1024 * 1024 }));
  });
  it("rejects larger or empty images", () => {
    for (const size of [0, 5 * 1024 * 1024 + 1])
      throws(() => validateProductImage({ type: "image/png", size }));
  });
  it("rejects executable image formats and nonimages", () => {
    for (const type of ["image/svg+xml", "text/html", "application/pdf"])
      throws(() => validateProductImage({ type, size: 100 }));
  });
});