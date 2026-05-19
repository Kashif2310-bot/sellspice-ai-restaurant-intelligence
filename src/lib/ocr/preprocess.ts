/**
 * Client-side bill image preprocessing before OCR upload.
 * Improves contrast and sharpness for restaurant receipt fonts.
 */

export interface PreprocessOptions {
  maxWidth?: number;
  contrast?: number;
  brightness?: number;
}

export async function preprocessBillImage(
  file: File,
  options: PreprocessOptions = {}
): Promise<{ file: File; base64: string }> {
  const { maxWidth = 1600, contrast = 1.25, brightness = 1.05 } = options;

  if (!file.type.startsWith("image/")) {
    const base64 = await fileToBase64(file);
    return { file, base64 };
  }

  const bitmap = await createImageBitmap(file);
  const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const base64 = await fileToBase64(file);
    return { file, base64 };
  }

  ctx.drawImage(bitmap, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    r = clamp((r - 128) * contrast + 128 * brightness);
    g = clamp((g - 128) * contrast + 128 * brightness);
    b = clamp((b - 128) * contrast + 128 * brightness);

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const mix = 0.15;
    data[i] = clamp(r * (1 - mix) + gray * mix);
    data[i + 1] = clamp(g * (1 - mix) + gray * mix);
    data[i + 2] = clamp(b * (1 - mix) + gray * mix);
  }

  ctx.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92)
  );

  if (!blob) {
    const base64 = await fileToBase64(file);
    return { file, base64 };
  }

  const processed = new File([blob], file.name.replace(/\.\w+$/, "") + "-ocr.jpg", {
    type: "image/jpeg",
  });
  const base64 = await fileToBase64(processed);
  return { file: processed, base64 };
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
