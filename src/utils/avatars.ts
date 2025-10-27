// src/avatars.ts
const avatarModules = import.meta.glob('../assets/avatars/*.png', { eager: true });

const avatars: string[] = Object.values(avatarModules).map((mod: any) => mod.default);

export default avatars;
