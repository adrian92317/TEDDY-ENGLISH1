import { useState } from "react";
import { Teddy } from "./Teddy";
import { pop } from "./sonidos";

/** Pantalla de prueba de la fase 0: Teddy y un botón ▶ que hace "pop". */
export function App() {
  const [saltos, setSaltos] = useState(0);

  const alTocar = () => {
    pop();
    setSaltos((n) => n + 1);
  };

  return (
    <main className="pantalla">
      <Teddy key={saltos} className={saltos > 0 ? "teddy feliz" : "teddy"} />
      <button className="boton-jugar" onClick={alTocar} aria-label="Jugar" data-testid="jugar">
        <svg viewBox="0 0 128 128" width="128" height="128" aria-hidden="true">
          <circle cx="64" cy="64" r="60" fill="#3DB36B" stroke="#2A8A50" strokeWidth="6" />
          <path d="M50 38 L96 64 L50 90 Z" fill="#fff" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      </button>
    </main>
  );
}
