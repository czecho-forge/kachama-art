import photos from "./showroom-photos.json";

// Showroom pieces. Photos come from scripts/build-showroom.mjs; everything a
// person edits by hand (title, colours, size) lives here.

export const COLOURS = [
  { id: "red", label: "Red", swatch: "#B3261E" },
  { id: "orange", label: "Orange", swatch: "#D9692B" },
  { id: "gold", label: "Gold", swatch: "#C9A23A" },
  { id: "green", label: "Green", swatch: "#5E8C4A" },
  { id: "blue", label: "Blue", swatch: "#2F6DB5" },
  { id: "indigo", label: "Indigo", swatch: "#22344A" },
  { id: "purple", label: "Purple", swatch: "#6E4A7E" },
  { id: "pink", label: "Pink", swatch: "#D58C8C" },
  { id: "brown", label: "Brown", swatch: "#7A4A2E" },
  { id: "natural", label: "Natural", swatch: "#E6DCC6" },
  { id: "multi", label: "Multicolour", swatch: "conic-gradient(#B3261E, #C9A23A, #5E8C4A, #2F6DB5, #6E4A7E, #B3261E)" },
] as const;

export type ColourId = (typeof COLOURS)[number]["id"];

// Bands go by the longest side, the measurement a buyer checks against a wall.
export const SIZES = [
  { id: "small", label: "Small", hint: "under 100 cm", max: 100 },
  { id: "medium", label: "Medium", hint: "100–150 cm", max: 150 },
  { id: "large", label: "Large", hint: "150–200 cm", max: 200 },
  { id: "xl", label: "Extra large", hint: "over 200 cm", max: Infinity },
] as const;

export type SizeId = (typeof SIZES)[number]["id"];

export type Photo = { name: string; w: number; h: number };

export type Piece = {
  id: string;
  title: string;
  colours: ColourId[];
  /** Width × height in cm; null until measured. */
  size: [number, number] | null;
  photos: Photo[];
};

type Details = Pick<Piece, "colours"> & Partial<Pick<Piece, "title" | "size">>;

const details: Record<string, Details> = {
  "01": { colours: ["brown", "green"] },
  "02": { colours: ["natural", "gold"] },
  "03": { colours: ["brown", "natural"] },
  "04": { colours: ["red", "green", "multi"] },
  "05": { colours: ["green"] },
  "06": { colours: ["orange", "gold"] },
  "07": { colours: ["pink", "brown"] },
  "08": { colours: ["brown"] },
  "09": { colours: ["indigo", "natural"] },
  "10": { colours: ["brown", "gold"] },
  "11": { colours: ["gold", "natural"] },
  "12": { colours: ["brown", "red"] },
  "13": { colours: ["natural"] },
  "14": { colours: ["blue", "purple"] },
  "15": { colours: ["natural"] },
  "16": { colours: ["brown", "natural", "multi"] },
  "17": { colours: ["red", "green", "gold"] },
  "18": { colours: ["blue"] },
  "19": { colours: ["brown", "purple"] },
  "20": { colours: ["natural", "blue"] },
  "21": { colours: ["gold", "brown"] },
  "22": { colours: ["gold", "brown"] },
  "23": { colours: ["orange", "brown"] },
  "24": { colours: ["natural"] },
  "25": { colours: ["orange", "red", "brown"] },
  "26": { colours: ["green"] },
  "27": { colours: ["purple"] },
  "28": { colours: ["purple", "blue"] },
  "29": { colours: ["gold", "brown"] },
  "30": { colours: ["natural", "blue"] },
  "31": { colours: ["gold"] },
  "32": { colours: ["indigo"] },
  "33": { colours: ["orange", "red"] },
  "34": { colours: ["blue"] },
  "35": { colours: ["gold", "natural"] },
  "36": { colours: ["indigo", "blue"] },
  "37": { colours: ["orange", "natural"] },
  "38": { colours: ["gold", "red"] },
  "39": { colours: ["indigo", "natural"] },
  "40": { colours: ["indigo"] },
  "41": { colours: ["blue"] },
  "42": { colours: ["orange", "multi"] },
  "43": { colours: ["gold"] },
  "44": { colours: ["brown"] },
  "45": { colours: ["gold", "orange", "multi"] },
  "46": { colours: ["gold"] },
  "47": { colours: ["blue", "multi"] },
  "48": { colours: ["pink", "brown"] },
  "49": { colours: ["multi", "green"] },
  "50": { colours: ["red", "pink"] },
  "51": { colours: ["brown", "gold"] },
  "52": { colours: ["orange", "brown", "natural"] },
  "53": { colours: ["pink", "orange"] },
  "54": { colours: ["gold", "purple"] },
  "55": { colours: ["blue", "multi"] },
  "56": { colours: ["pink", "orange"] },
  "57": { colours: ["red", "brown"] },
  "58": { colours: ["red", "multi"] },
  "59": { colours: ["red", "gold"] },
  "60": { colours: ["orange", "natural"] },
  "61": { colours: ["multi", "brown"] },
  "62": { colours: ["purple"] },
  "63": { colours: ["pink", "purple"] },
  "64": { colours: ["blue", "brown"] },
  "65": { colours: ["blue"] },
  "66": { colours: ["blue", "green"] },
};

// Sort explicitly: JS orders integer-like keys ("10") before zero-padded ones ("01").
export const pieces: Piece[] = Object.entries(photos as Record<string, Photo[]>)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([id, list]) => ({
    id,
    title: details[id]?.title ?? `Weaving No. ${id}`,
    colours: details[id]?.colours ?? [],
    size: details[id]?.size ?? null,
    photos: list,
  }));

export function sizeBand(piece: Piece): SizeId | null {
  if (!piece.size) return null;
  const longest = Math.max(...piece.size);
  return SIZES.find((s) => longest < s.max)!.id;
}

export function photoSrc(pieceId: string, photo: Photo, width: 800 | 1600) {
  return `/images/showroom/${pieceId}/${photo.name}-${width}.webp`;
}

export function photoSrcSet(pieceId: string, photo: Photo) {
  return `${photoSrc(pieceId, photo, 800)} 800w, ${photoSrc(pieceId, photo, 1600)} 1600w`;
}
