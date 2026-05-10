export const lighten = (hex: string, t: number): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return (
    "#" +
    [mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
};

export const darken = (hex: string, t: number): string => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const mix = (c: number) => Math.round(c * (1 - t));
  return (
    "#" +
    [mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
};