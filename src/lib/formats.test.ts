import { describe, expect, it } from "vitest";
import { formatLabel, isSupportedImage } from "./formats";

describe("formats", () => {
  it("detects supported image extensions case-insensitively", () => {
    expect(isSupportedImage("C:/photos/image.PNG")).toBe(true);
    expect(isSupportedImage("C:/photos/image.webp")).toBe(true);
    expect(isSupportedImage("C:/photos/readme.txt")).toBe(false);
  });

  it("formats friendly labels", () => {
    expect(formatLabel("jpg")).toBe("JPG");
    expect(formatLabel("tiff")).toBe("TIFF");
  });
});
