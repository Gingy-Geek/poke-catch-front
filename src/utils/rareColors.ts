export const rarityColors: Record<string, string> = {
  common: "#CBD5E1",    
  rare: "#e360faff",
  legendary: "#FBBF24", 
};

export const getRarityColor = (rarity?: "common" | "rare" | "legendary"): string => {
  if (!rarity) return "#CBD5E1"; 
  return rarityColors[rarity] ?? "#CBD5E1";
};