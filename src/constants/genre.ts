export const GENRES = [
  "動物",
  "人物",
  "キャラクター",
  "ホラー",
  "自然",
  "食べ物",
  "物体",
  "その他",
] as const;

export type Genre = (typeof GENRES)[number];