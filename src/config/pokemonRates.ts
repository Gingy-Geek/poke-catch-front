export type Rarity = "common" | "rare" | "legendary";

// solo lectura
export const baseCatchRates: Record<Rarity, number> = {
  common: 0.7,
  rare: 0.4,
  legendary: 0.1
};

// solo lectura
export const spawnRates: Record<Rarity, number> = {
  common: 0.8,
  rare: 0.18,
  legendary: 0.02
};

export const shinyRate: Record<string, number> = {
  shiny: 0.15,
};