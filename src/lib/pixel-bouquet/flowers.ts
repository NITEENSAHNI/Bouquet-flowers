import { lighten, darken } from "./colors";

const stemLeaves = (uid: string): string => `
  <defs>
    <linearGradient id="sg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4a8055"/>
      <stop offset="100%" stop-color="#3d6b45"/>
    </linearGradient>
  </defs>
  <path d="M88 218 C87 178 87 148 90 138" stroke="#3d6b45" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M88 185 C55 168 38 180 40 198 C62 208 80 200 89 188Z" fill="url(#sg${uid})"/>
  <path d="M92 200 C125 182 148 186 150 204 C130 214 108 210 91 202Z" fill="url(#sg${uid})"/>
  <path d="M55 178 C70 184 80 186 86 184" stroke="#6ab56a" stroke-width="2" fill="none" stroke-linecap="round" stroke-opacity="0.4"/>
  <path d="M148 196 C133 200 116 202 93 200" stroke="#6ab56a" stroke-width="2" fill="none" stroke-linecap="round" stroke-opacity="0.4"/>
`;

export const drawRose = (col: string, uid: string): string => {
  const lo = lighten(col, 0.55), hi = lighten(col, 0.75);
  const dk = darken(col, 0.5),   mid = lighten(col, 0.12);
  const lm = lighten(col, 0.28);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rg2${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${lo}"/>
      <stop offset="60%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
    <linearGradient id="rg3${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${lm}"/>
      <stop offset="100%" stop-color="${col}"/>
    </linearGradient>
  </defs>
  ${stemLeaves(uid)}
  <path d="M90 38 C62 42 42 72 48 105 C68 92 82 82 90 80 C98 82 112 92 132 105 C138 72 118 42 90 38Z" fill="url(#rg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M44 88 C30 118 42 158 78 168 C70 138 74 112 88 92 C72 78 54 78 44 88Z" fill="url(#rg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M136 88 C126 78 108 78 92 92 C106 112 110 138 102 168 C138 158 150 118 136 88Z" fill="url(#rg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M68 140 C72 162 82 176 90 182 C98 176 108 162 112 140 C100 128 80 128 68 140Z" fill="url(#rg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M90 56 C72 64 62 94 72 112 C78 122 84 126 90 130 C96 126 102 122 108 112 C118 94 108 64 90 56Z" fill="url(#rg3${uid})" stroke="${lm}" stroke-width="1"/>
  <path d="M90 68 C80 78 78 102 82 114 C86 120 90 124 90 124 C90 124 94 120 98 114 C102 102 100 78 90 68Z" fill="${mid}" opacity="0.9"/>
  <path d="M84 76 C86 66 94 64 98 70 C102 76 98 84 90 90 C82 84 78 82 84 76Z" fill="${hi}" opacity="0.95"/>
  <path d="M70 62 C60 88 66 114 80 130" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-opacity="0.28"/>
  </svg>`;
};

export const drawSunflower = (_col: string, uid: string): string => {
  const pc = "#e9a020", pd = "#c47a10", ph = "#fff0a0";
  const dc = "#4a2008", dh = "#7a3f12", ds = "#2a1004";
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pfg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ph}"/>
      <stop offset="40%" stop-color="${pc}"/>
      <stop offset="100%" stop-color="${pd}"/>
    </linearGradient>
    <radialGradient id="dcg${uid}">
      <stop offset="0%" stop-color="${dh}"/>
      <stop offset="100%" stop-color="${dc}"/>
    </radialGradient>
    <filter id="sg2${uid}"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  ${stemLeaves(uid)}
  <g transform="translate(90,88)">
    <g id="spetal${uid}">
      <path d="M0 -78 C-14 -62 -16 -35 0 -10 C16 -35 14 -62 0 -78Z" fill="url(#pfg${uid})" stroke="${ph}" stroke-width="1"/>
      <path d="M0 -72 C-3 -55 -2 -36 0 -20 C2 -36 3 -55 0 -72Z" fill="${ph}" opacity="0.3"/>
    </g>
    ${Array.from({ length: 20 }, (_, i) => `<use href="#spetal${uid}" transform="rotate(${i * 18})"/>`).join("")}
    <g transform="scale(0.78)">
      ${Array.from({ length: 20 }, (_, i) => `<use href="#spetal${uid}" transform="rotate(${9 + i * 18})"/>`).join("")}
    </g>
  </g>
  <circle cx="90" cy="88" r="42" fill="url(#dcg${uid})" filter="url(#sg2${uid})"/>
  <g fill="${ds}">
    <circle cx="88" cy="68" r="2.8"/><circle cx="78" cy="78" r="2.8"/>
    <circle cx="90" cy="80" r="2.8"/><circle cx="100" cy="76" r="2.8"/>
    <circle cx="74" cy="92" r="2.8"/><circle cx="88" cy="94" r="2.8"/>
    <circle cx="102" cy="90" r="2.8"/><circle cx="78" cy="104" r="2.8"/>
    <circle cx="92" cy="106" r="2.8"/><circle cx="86" cy="78" r="2"/>
    <circle cx="96" cy="88" r="2"/><circle cx="82" cy="96" r="2"/>
  </g>
  <circle cx="90" cy="88" r="48" fill="none" stroke="${ph}" stroke-opacity="0.12" stroke-width="10"/>
  </svg>`;
};

export const drawTulip = (col: string, uid: string): string => {
  const lo = lighten(col, 0.55), hi = lighten(col, 0.78);
  const dk = darken(col, 0.42), dkMid = darken(col, 0.3);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tpg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="35%" stop-color="${lo}"/>
      <stop offset="72%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
  </defs>
  ${stemLeaves(uid)}
  <path d="M90 38 C54 58 38 100 50 148 C68 168 112 168 130 148 C142 100 126 58 90 38Z" fill="url(#tpg${uid})" stroke="${lo}" stroke-width="2.5"/>
  <path d="M50 148 L72 108 L90 140 L108 108 L130 148 Q90 172 50 148Z" fill="${dkMid}"/>
  <path d="M90 56 C78 78 80 118 90 140 C100 118 102 78 90 56Z" fill="${hi}" opacity="0.42"/>
  <path d="M68 62 C60 90 64 125 76 148" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-opacity="0.28"/>
  </svg>`;
};

export const drawDaisy = (col: string, uid: string): string => {
  const ps2 = darken(col, 0.18);
  const dc = "#f5c518", dce = "#c9971a", dch = lighten("#f5c518", 0.5);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dpg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="white"/>
      <stop offset="65%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${ps2}"/>
    </linearGradient>
    <radialGradient id="dcg2${uid}">
      <stop offset="0%" stop-color="${dch}"/>
      <stop offset="58%" stop-color="${dc}"/>
      <stop offset="100%" stop-color="${dce}"/>
    </radialGradient>
    <filter id="dg${uid}"><feGaussianBlur stdDeviation="1.5"/></filter>
  </defs>
  ${stemLeaves(uid)}
  <g transform="translate(90,88)">
    <g id="dpetal${uid}">
      <path d="M0 -72 C-10 -60 -12 -36 0 -10 C12 -36 10 -60 0 -72Z" fill="url(#dpg${uid})" stroke="white" stroke-width="1"/>
      <path d="M0 -67 C-2 -50 -1.5 -30 0 -15 C1.5 -30 2 -50 0 -67Z" fill="white" opacity="0.3"/>
    </g>
    ${Array.from({ length: 24 }, (_, i) => `<use href="#dpetal${uid}" transform="rotate(${i * 15})"/>`).join("")}
  </g>
  <circle cx="90" cy="88" r="30" fill="url(#dcg2${uid})" filter="url(#dg${uid})"/>
  <g fill="${dce}">
    <circle cx="83" cy="78" r="2.2"/><circle cx="92" cy="74" r="2.2"/>
    <circle cx="100" cy="80" r="2.2"/><circle cx="78" cy="90" r="2.2"/>
    <circle cx="92" cy="92" r="2.2"/><circle cx="104" cy="88" r="2.2"/>
    <circle cx="85" cy="102" r="2.2"/><circle cx="97" cy="100" r="2.2"/>
  </g>
  </svg>`;
};

export const drawLavender = (col: string, uid: string): string => {
  const dk = darken(col, 0.38), hi = lighten(col, 0.45);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lavpg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="30%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
    <linearGradient id="lavsg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bfff82"/>
      <stop offset="100%" stop-color="#2b6a34"/>
    </linearGradient>
    <filter id="lavg${uid}"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <g stroke="url(#lavsg${uid})" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M72 218 C74 170 72 120 68 72"/>
    <path d="M90 218 C90 168 90 118 90 52"/>
    <path d="M108 218 C106 170 108 120 112 82"/>
  </g>
  <g filter="url(#lavg${uid})">
    <g transform="translate(68,70)">
      <ellipse cx="-8" cy="0"  rx="11" ry="17" fill="url(#lavpg${uid})" transform="rotate(-15)"/>
      <ellipse cx="7"  cy="14" rx="11" ry="17" fill="url(#lavpg${uid})" transform="rotate(12)"/>
      <ellipse cx="-6" cy="30" rx="10" ry="15" fill="url(#lavpg${uid})" transform="rotate(-8)"/>
      <ellipse cx="6"  cy="46" rx="9"  ry="14" fill="url(#lavpg${uid})" transform="rotate(10)"/>
      <ellipse cx="-4" cy="60" rx="8"  ry="12" fill="url(#lavpg${uid})" transform="rotate(-6)"/>
    </g>
    <g transform="translate(90,50)">
      <ellipse cx="0"  cy="0"  rx="13" ry="20" fill="url(#lavpg${uid})"/>
      <ellipse cx="-8" cy="20" rx="12" ry="18" fill="url(#lavpg${uid})" transform="rotate(-8)"/>
      <ellipse cx="8"  cy="40" rx="11" ry="17" fill="url(#lavpg${uid})" transform="rotate(8)"/>
      <ellipse cx="-6" cy="60" rx="10" ry="15" fill="url(#lavpg${uid})" transform="rotate(-6)"/>
      <ellipse cx="6"  cy="78" rx="9"  ry="13" fill="url(#lavpg${uid})" transform="rotate(6)"/>
    </g>
    <g transform="translate(112,78)">
      <ellipse cx="8"  cy="0"  rx="11" ry="17" fill="url(#lavpg${uid})" transform="rotate(15)"/>
      <ellipse cx="-8" cy="16" rx="11" ry="16" fill="url(#lavpg${uid})" transform="rotate(-10)"/>
      <ellipse cx="6"  cy="34" rx="10" ry="15" fill="url(#lavpg${uid})" transform="rotate(8)"/>
      <ellipse cx="-6" cy="52" rx="9"  ry="13" fill="url(#lavpg${uid})" transform="rotate(-6)"/>
    </g>
  </g>
  <g fill="white" opacity="0.22">
    <ellipse cx="62" cy="70" rx="3" ry="6"/>
    <ellipse cx="90" cy="52" rx="3" ry="6"/>
    <ellipse cx="120" cy="80" rx="3" ry="6"/>
  </g>
  <path d="M60 178 C30 162 10 172 14 202 C42 214 62 204 68 182Z" fill="url(#lavsg${uid})"/>
  <path d="M118 185 C125 158 158 160 166 192 C144 210 118 205 118 187Z" fill="url(#lavsg${uid})"/>
  </svg>`;
};

export const drawLily = (col: string, uid: string): string => {
  const lo = lighten(col, 0.5), dk = darken(col, 0.38), hi = lighten(col, 0.8);
  const spot = "#8B0000", stamen = "#f5c518";
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lpg${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="45%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
    <filter id="lg2${uid}"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  ${stemLeaves(uid)}
  <path d="M90 30 C80 42 80 68 90 85 C100 68 100 42 90 30Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5" filter="url(#lg2${uid})"/>
  <path d="M36 68 C28 88 42 118 72 128 C80 108 70 82 36 68Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5" filter="url(#lg2${uid})"/>
  <path d="M144 68 C110 82 100 108 108 128 C138 118 152 88 144 68Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5" filter="url(#lg2${uid})"/>
  <path d="M52 122 C48 148 60 170 82 175 C88 155 84 132 68 120 C62 116 54 116 52 122Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M128 122 C126 116 118 116 112 120 C96 132 92 155 98 175 C120 170 132 148 128 122Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M90 78 C80 92 82 118 90 132 C98 118 100 92 90 78Z" fill="url(#lpg${uid})" stroke="${lo}" stroke-width="1.5"/>
  <g fill="${spot}" opacity="0.75">
    <circle cx="82" cy="98" r="3"/><circle cx="90" cy="108" r="3"/>
    <circle cx="98" cy="100" r="3"/><circle cx="86" cy="116" r="2.5"/>
    <circle cx="94" cy="118" r="2.5"/><circle cx="78" cy="110" r="2.5"/>
  </g>
  <line x1="90" y1="88" x2="74" y2="56"  stroke="${stamen}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="90" y1="88" x2="106" y2="56" stroke="${stamen}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="90" y1="88" x2="68"  y2="82" stroke="${stamen}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="90" y1="88" x2="112" y2="82" stroke="${stamen}" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="74"  cy="53" rx="4" ry="7" fill="#e05010"/>
  <ellipse cx="106" cy="53" rx="4" ry="7" fill="#e05010"/>
  <ellipse cx="68"  cy="80" rx="4" ry="7" fill="#e05010"/>
  <ellipse cx="112" cy="80" rx="4" ry="7" fill="#e05010"/>
  </svg>`;
};

export const drawOrchid = (col: string, uid: string): string => {
  const lo = lighten(col, 0.62);
  const dk = darken(col, 0.45), lm = lighten(col, 0.35);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="op1${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${lighten(col, 0.82)}"/>
      <stop offset="30%" stop-color="${lo}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
    <linearGradient id="op2${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff8d0"/>
      <stop offset="100%" stop-color="#ff8c00"/>
    </linearGradient>
    <filter id="og${uid}"><feGaussianBlur stdDeviation="2.5"/></filter>
  </defs>
  ${stemLeaves(uid)}
  <path d="M90 28 C74 40 68 72 80 98 C84 106 90 108 90 98 C90 108 96 106 100 98 C112 72 106 40 90 28Z" fill="url(#op1${uid})" stroke="${lo}" stroke-width="2" filter="url(#og${uid})"/>
  <path d="M38 72 C22 90 26 125 55 138 C72 144 86 132 90 112 C76 90 58 72 38 72Z" fill="url(#op1${uid})" stroke="${lo}" stroke-width="2" filter="url(#og${uid})"/>
  <path d="M142 72 C122 72 104 90 90 112 C94 132 108 144 125 138 C154 125 158 90 142 72Z" fill="url(#op1${uid})" stroke="${lo}" stroke-width="2" filter="url(#og${uid})"/>
  <path d="M56 122 C46 142 52 168 78 175 C88 160 88 140 80 120 C72 112 62 114 56 122Z" fill="${lm}" stroke="${lo}" stroke-width="1.5"/>
  <path d="M124 122 C118 114 108 112 100 120 C92 140 92 160 102 175 C128 168 134 142 124 122Z" fill="${lm}" stroke="${lo}" stroke-width="1.5"/>
  <path d="M90 96 C72 110 68 148 90 165 C112 148 108 110 90 96Z" fill="url(#op2${uid})" stroke="#ffe0a0" stroke-width="1.5"/>
  <ellipse cx="90" cy="136" rx="18" ry="24" fill="#ff6800" opacity="0.85"/>
  <g fill="${dk}" opacity="0.65">
    <circle cx="80" cy="118" r="2.5"/><circle cx="88" cy="126" r="2.5"/>
    <circle cx="96" cy="122" r="2.5"/><circle cx="84" cy="138" r="2"/>
    <circle cx="96" cy="140" r="2"/><circle cx="88" cy="150" r="2"/>
  </g>
  <path d="M76 48 C70 68 72 90 82 108" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-opacity="0.32"/>
  </svg>`;
};

export const drawPeony = (col: string, uid: string): string => {
  const lo = lighten(col, 0.52), lm = lighten(col, 0.28);
  const hi = lighten(col, 0.75), dk = darken(col, 0.42);
  const mid = lighten(col, 0.14), inner = lighten(col, 0.36);
  return `<svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pg1${uid}" cx="38%" cy="32%">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="55%" stop-color="${col}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </radialGradient>
    <linearGradient id="pg2${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${lo}"/>
      <stop offset="100%" stop-color="${dk}"/>
    </linearGradient>
    <linearGradient id="pg3${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${inner}"/>
      <stop offset="100%" stop-color="${mid}"/>
    </linearGradient>
    <filter id="peog${uid}"><feGaussianBlur stdDeviation="1.5"/></filter>
  </defs>
  ${stemLeaves(uid)}
  <path d="M90 32 C52 34 28 68 36 112 C58 98 76 86 90 84 C104 86 122 98 144 112 C152 68 128 34 90 32Z" fill="url(#pg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M32 90 C18 122 30 162 68 172 C62 148 65 118 82 96 C62 80 40 76 32 90Z" fill="url(#pg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M148 90 C140 76 118 80 98 96 C115 118 118 148 112 172 C150 162 162 122 148 90Z" fill="url(#pg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M62 148 C65 170 78 182 90 188 C102 182 115 170 118 148 C104 134 76 134 62 148Z" fill="url(#pg2${uid})" stroke="${lo}" stroke-width="1.5"/>
  <path d="M90 55 C68 60 55 90 62 110 C68 124 78 132 90 136 C102 132 112 124 118 110 C125 90 112 60 90 55Z" fill="url(#pg1${uid})" stroke="${lm}" stroke-width="1" filter="url(#peog${uid})"/>
  <path d="M90 68 C76 74 70 98 74 112 C78 122 84 128 90 132 C96 128 102 122 106 112 C110 98 104 74 90 68Z" fill="url(#pg3${uid})"/>
  <path d="M90 82 C82 86 80 106 84 116 C87 122 90 126 90 126 C90 126 93 122 96 116 C100 106 98 86 90 82Z" fill="${mid}" opacity="0.88"/>
  <path d="M82 72 C84 60 92 58 96 64 C100 70 96 80 90 88 C84 80 78 78 82 72Z" fill="${hi}" opacity="0.9"/>
  <path d="M58 52 C50 78 55 115 68 140" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-opacity="0.25"/>
  <path d="M122 52 C130 78 125 115 112 140" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-opacity="0.18"/>
  </svg>`;
};

export interface FlowerDef {
  id: string;
  name: string;
  meaning: string;
  colors: string[];
}

export const FLOWERS: FlowerDef[] = [
  { id: "rose", name: "Rose", meaning: "Love & passion", colors: ["#c0303a", "#e05c1a", "#d44090", "#cc2266", "#ffb3c1"] },
  { id: "sunflower", name: "Sunflower", meaning: "Joy & warmth", colors: ["#e9a020", "#f5c518", "#c47a10"] },
  { id: "tulip", name: "Tulip", meaning: "Perfect love", colors: ["#d63864", "#a020a0", "#e05020", "#f5a0b0", "#f0d040"] },
  { id: "daisy", name: "Daisy", meaning: "Innocence & hope", colors: ["#f5f5f0", "#fce4a0", "#f0c8d0"] },
  { id: "lavender", name: "Lavender", meaning: "Calm & grace", colors: ["#9b72cf", "#b490e8", "#7050a0", "#d0a0e0"] },
  { id: "lily", name: "Lily", meaning: "Purity & renewal", colors: ["#ffffff", "#ffb0c0", "#f8c060", "#d0e8ff"] },
  { id: "orchid", name: "Orchid", meaning: "Rare beauty", colors: ["#9020b0", "#d060e0", "#4040c0", "#e080a0", "#60a060"] },
  { id: "peony", name: "Peony", meaning: "Prosperity", colors: ["#e87890", "#d04060", "#f0a0c0", "#c060a0", "#f5c0d0"] },
];

export const RENDERERS: Record<string, (col: string, uid: string) => string> = {
  rose: drawRose,
  sunflower: drawSunflower,
  tulip: drawTulip,
  daisy: drawDaisy,
  lavender: drawLavender,
  lily: drawLily,
  orchid: drawOrchid,
  peony: drawPeony,
};

export const OCCASIONS = [
  { id: "birthday", label: "🎂 Birthday" },
  { id: "love", label: "❤️ Love" },
  { id: "congrats", label: "🎉 Congrats" },
  { id: "getwell", label: "🌿 Get Well" },
  { id: "justbecause", label: "✨ Just Because" },
  { id: "sorry", label: "🕊️ Sorry" },
];