const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  tv: "TV",
  air_conditioning: "Ar-condicionado",
  kitchen: "Cozinha",
  washing_machine: "Máquina de lavar",
  elevator: "Elevador",
  balcony: "Sacada",
  bbq_grill: "Churrasqueira",
  dishwasher: "Lava-louças",
  pool: "Piscina",
  parking: "Estacionamento",
};

export const amenityLabel = (key: string): string =>
  AMENITY_LABELS[key] ??
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Masks a Brazilian phone number into a readable format.
 * e.g. "+5548991234567" -> "+55 (48) 99123-4567"
 * Falls back to the original string if it doesn't match the expected shape.
 */
export const formatPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  const match = digits.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return phone;
  const [, country, area, prefix, suffix] = match;
  return `+${country} (${area}) ${prefix}-${suffix}`;
};

/**
 * Builds a WhatsApp deep link (wa.me) that opens a chat with the given number,
 * optionally pre-filling a message.
 */
export const formatWhatsappHref = (phone: string, message?: string): string => {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/**
 * Builds a Google Maps link that searches for the given address. Uses the
 * documented Maps URL API (search by free-text query), which resolves the
 * address on Google's side and works on web, Android and iOS without needing
 * coordinates.
 */
export const googleMapsHref = (query: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
