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

export const formatPhoneHref = (phone: string): string =>
  `tel:${phone.replace(/[^+\d]/g, "")}`;
