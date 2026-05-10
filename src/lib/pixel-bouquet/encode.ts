export interface BouquetState {
  flowers: { id: string; color: string }[];
  occasion: string;
  toName: string;
  fromName: string;
  message: string;
}

export function encodeBouquet(state: BouquetState): string {
  const obj = {
    f: state.flowers.map((f) => ({ i: f.id, c: f.color })),
    o: state.occasion,
    t: state.toName,
    r: state.fromName,
    m: state.message,
  };
  return btoa(encodeURIComponent(JSON.stringify(obj)));
}

export function decodeBouquet(hash: string): BouquetState | null {
  try {
    const obj = JSON.parse(decodeURIComponent(atob(hash)));
    return {
      flowers: (obj.f || []).map((f: { i: string; c: string }) => ({
        id: f.i,
        color: f.c,
      })),
      occasion: obj.o || "",
      toName: obj.t || "",
      fromName: obj.r || "",
      message: obj.m || "",
    };
  } catch {
    return null;
  }
}