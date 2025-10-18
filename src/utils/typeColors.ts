export const typeColors: Record<string, string> = {
  normal: "#F5F5DC",    // beige claro
  fire: "#FFE5D4",      // naranja suave
  water: "#DCEEFB",     // azul suave
  electric: "#FFF9C4",  // amarillo pastel
  grass: "#DFFFD6",     // verde suave
  ice: "#E0F7FA",       // celeste muy suave
  fighting: "#FDD8D5",  // rojo pastel
  poison: "#F3D9F7",    // lila suave
  ground: "#F5E6C3",    // marrón claro
  flying: "#EDEBFF",    // violeta muy suave
  psychic: "#FFD1DD",   // rosa suave
  bug: "#F0FAD6",       // verde claro
  rock: "#EEE3C1",      // marrón suave
  ghost: "#E6E0F8",     // morado claro
  dragon: "#E0D4FF",    // violeta pastel
  dark: "#D8D4C8",      // gris/marrón suave
  steel: "#E4E4F1",     // gris pastel
  fairy: "#FFE0F0",     // rosa pastel
};


export const getTypeColor = (types?: string | string[]): string => {
  if (!types) return "white";

  // Normaliza: convierte string → array de un elemento
  const typeArray = Array.isArray(types) ? types : [types];

  if (typeArray.length === 1) return typeColors[typeArray[0]] || "white";
  return `linear-gradient(90deg, ${typeColors[typeArray[0]]}, ${typeColors[typeArray[1]]})`;
};
