export type ImageFormat = "png" | "jpg" | "jpeg" | "webp" | "bmp" | "tiff";

export type ImageInfo = {
  path: string;
  filename: string;
  format: ImageFormat;
  width: number;
  height: number;
};

export type ConversionHistoryItem = {
  original_filename: string;
  input_format: string;
  output_format: string;
  timestamp: string;
  result_status: "success" | "failure";
};

export type ConversionResult = {
  output_path: string;
  history: ConversionHistoryItem;
};
