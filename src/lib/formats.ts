import type { ImageFormat } from "../types";

export const SUPPORTED_FORMATS: ImageFormat[] = ["png", "jpg", "jpeg", "webp", "bmp", "tiff"];

export const OUTPUT_FORMATS: ImageFormat[] = ["png", "jpg", "webp", "bmp", "tiff"];

const FORMAT_LABELS: Record<ImageFormat, string> = {
  png: "PNG",
  jpg: "JPG",
  jpeg: "JPEG",
  webp: "WEBP",
  bmp: "BMP",
  tiff: "TIFF"
};

export function formatLabel(format: ImageFormat | string): string {
  return FORMAT_LABELS[format as ImageFormat] ?? format.toUpperCase();
}

export function isSupportedImage(path: string): boolean {
  const extension = path.split(".").pop()?.toLowerCase();
  return Boolean(extension && SUPPORTED_FORMATS.includes(extension as ImageFormat));
}
