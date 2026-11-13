// Sonidos cortos generados con Web Audio (sección 3 de la especificación).
let contexto: AudioContext | null = null;

/** Crea o reanuda el contexto de audio. Debe llamarse dentro de un toque del usuario. */
export function desbloquearAudio(): AudioContext {
  contexto ??= new AudioContext();
  if (contexto.state === "suspended") void contexto.resume();
  return contexto;
}

export function pop(): void {
  const ctx = desbloquearAudio();
  const ahora = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gan = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, ahora);
  osc.frequency.exponentialRampToValueAtTime(1040, ahora + 0.09);
  gan.gain.setValueAtTime(0.0001, ahora);
  gan.gain.exponentialRampToValueAtTime(0.5, ahora + 0.01);
  gan.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.2);
  osc.connect(gan).connect(ctx.destination);
  osc.start(ahora);
  osc.stop(ahora + 0.22);
}
