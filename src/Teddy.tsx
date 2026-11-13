export const COLORES_BUFANDA = {
  roja: "#E5484D",
  azul: "#3E8EDE",
  amarilla: "#F5C518",
  verde: "#3DB36B",
} as const;

export type ColorBufanda = keyof typeof COLORES_BUFANDA;

interface Props {
  bufanda?: ColorBufanda;
  className?: string;
}

/** Teddy: osito original dibujado en SVG. */
export function Teddy({ bufanda = "roja", className }: Props) {
  const color = COLORES_BUFANDA[bufanda];
  return (
    <svg viewBox="0 0 200 220" className={className} role="img" aria-label="Teddy">
      {/* cuerpo */}
      <ellipse cx="100" cy="172" rx="52" ry="44" fill="#C98A4B" />
      <ellipse cx="100" cy="178" rx="30" ry="28" fill="#F1D3A8" />
      {/* orejas */}
      <circle cx="48" cy="42" r="24" fill="#C98A4B" />
      <circle cx="152" cy="42" r="24" fill="#C98A4B" />
      <circle cx="48" cy="42" r="12" fill="#F1D3A8" />
      <circle cx="152" cy="42" r="12" fill="#F1D3A8" />
      {/* cabeza */}
      <circle cx="100" cy="82" r="62" fill="#C98A4B" />
      {/* hocico */}
      <ellipse cx="100" cy="102" rx="28" ry="22" fill="#F1D3A8" />
      <ellipse cx="100" cy="92" rx="10" ry="7" fill="#4A2F1B" />
      <path d="M86 106 Q100 120 114 106" fill="none" stroke="#4A2F1B" strokeWidth="4" strokeLinecap="round" />
      {/* ojos */}
      <circle cx="76" cy="72" r="8" fill="#4A2F1B" />
      <circle cx="124" cy="72" r="8" fill="#4A2F1B" />
      <circle cx="79" cy="69" r="2.5" fill="#fff" />
      <circle cx="127" cy="69" r="2.5" fill="#fff" />
      {/* mejillas */}
      <circle cx="58" cy="98" r="8" fill="#F29C8A" opacity="0.6" />
      <circle cx="142" cy="98" r="8" fill="#F29C8A" opacity="0.6" />
      {/* bufanda */}
      <path d="M52 132 Q100 158 148 132 L150 148 Q100 174 50 148 Z" fill={color} />
      <path d="M118 150 L140 146 L146 190 L124 194 Z" fill={color} />
      <path d="M126 184 L145 180" stroke="#fff" strokeWidth="3" opacity="0.6" />
    </svg>
  );
}
