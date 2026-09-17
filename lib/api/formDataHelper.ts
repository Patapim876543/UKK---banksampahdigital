/**
 * Shared helper to convert an object with optional File to FormData
 */
export function buildFormData(data: Record<string, any>, fileField = "foto"): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (key === fileField && value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object" && !(value instanceof File) && !(value instanceof Blob)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
