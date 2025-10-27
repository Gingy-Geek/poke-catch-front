type PokemonVariant = { 
  seen: number; 
  obtained: number 
};
type Stats = { 
  hp: number; 
  attack: number,
  defense: number,
  speed: number 
};

export type PokemonData = {
  id:number,
  variants: { 
    normal: PokemonVariant; 
    shiny: PokemonVariant 
  };
  name: string,
  weight: number,
  height: number,
  sprite: string,
  shinySprite: string,
  animatedSprite: string,
  animatedShinySprite:string,
  rarity: "legendary" | "rare" | "common"
  types: string[],
  weaknesses: string[],
  stats: Stats,
  description: string,
  audio: string
  
};

export type UserData = {
  uid: string;
  displayName:string;
  avatar:number;
  pokedex: Record<string, PokemonData>;
  masterBalls: number;
  dailyCatches: number;
  seen: number;
  obtained: number
};