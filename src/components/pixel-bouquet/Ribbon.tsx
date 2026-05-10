const RIBBON_COLORS = ["#d4727a", "#c9972a", "#9b8ec4", "#7a9e7e", "#e87890", "#a85a8d"];

export function Ribbon({ count }: { count: number }) {
  const c = RIBBON_COLORS[Math.max(0, count - 1) % RIBBON_COLORS.length];
  const dark = c;
  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      className="absolute left-1/2 -translate-x-1/2 bottom-2 drop-shadow-md"
    >
      {/* bow loops */}
      <ellipse cx="46" cy="18" rx="14" ry="9" fill={c} opacity="0.9" />
      <ellipse cx="74" cy="18" rx="14" ry="9" fill={c} opacity="0.9" />
      <ellipse cx="46" cy="18" rx="6" ry="4" fill={dark} opacity="0.5" />
      <ellipse cx="74" cy="18" rx="6" ry="4" fill={dark} opacity="0.5" />
      {/* knot */}
      <rect x="54" y="14" width="12" height="14" rx="2" fill={dark} />
      {/* ribbon body */}
      <path d="M30 30 L90 30 L96 56 L24 56 Z" fill={c} />
      <path d="M30 30 L90 30 L88 36 L32 36 Z" fill="white" opacity="0.25" />
      {/* tails */}
      <path d="M44 30 L40 58 L48 50 Z" fill={dark} opacity="0.5" />
      <path d="M76 30 L80 58 L72 50 Z" fill={dark} opacity="0.5" />
    </svg>
  );
}