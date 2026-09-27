export function parseProduct(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Invalid offer");
  const input = body as Record<string, unknown>;
  const string = (key: string, max: number) => {
    const value = input[key];
    if (value == null) return "";
    if (typeof value !== "string" || value.length > max)
      throw new Error(`Invalid ${key}`);
    return value.trim();
  };
  const title = string("title", 180);
  if (!title) throw new Error("Title required");
  const imageBase64 = string("imageBase64", 7 * 1024 * 1024);
  if (
    imageBase64 &&
    !/^(data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$|https?:\/\/[^\s]+$)/i.test(
      imageBase64,
    )
  )
    throw new Error("Invalid image");
  if (input.active !== undefined && typeof input.active !== "boolean")
    throw new Error("Invalid visibility");
  return {
    title,
    description: string("description", 10000),
    imageBase64,
    location: string("location", 200),
    minOrder: string("minOrder", 100),
    price: string("price", 100),
    currency: string("currency", 10),
    category: string("category", 100),
    active: input.active ?? true,
  };
}
export function parseProductId(value: string): number {
  if (!/^[1-9]\d*$/.test(value)) throw new Error("Invalid ID");
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id > 2147483647)
    throw new Error("Invalid ID");
  return id;
}
