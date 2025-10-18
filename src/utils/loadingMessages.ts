// src/utils/pokemonMessages.ts
export const SEARCH_MESSAGES = [
  "Searching for wild Pokémon...",
  "Tall grass is rustling...",
  "Something’s moving nearby...",
  "Scanning the area...",
  "Looking for a wild encounter...",
  "A Pokémon might be hiding here...",
  "Exploring the tall grass...",
  "Tracking Pokémon signals...",
  "Your Pokédex is scanning the surroundings...",
  "Sniffing out a wild Pokémon...",
  "Detecting life forms...",
  "The Poké Radar is beeping...",
  "A wild presence is approaching...",
  "Something is lurking in the shadows...",
  "The air feels electric...",
  "Footsteps can be heard nearby...",
  "A mysterious aura appears...",
  "You sense a Pokémon’s presence...",
  "Grass is shaking violently...",
  "The hunt begins..."
];

export const getRandomSearchMessage = () =>
  SEARCH_MESSAGES[Math.floor(Math.random() * SEARCH_MESSAGES.length)];
