# Teddy English — instrucciones del proyecto

App web instalable (PWA) para que **Adriel, de 6 años, que todavía no lee**, aprenda inglés en un **celular Android**. Copia el ciclo de interacción de Synthesis Tutor: un tutor (Teddy, un osito) que habla, una escena grande que el niño toca y arrastra, y una respuesta a cada acción del niño. **No es un juego de preguntas sueltas tipo Duolingo.**

La especificación completa está en `docs/ESPECIFICACION.md`. Léela entera antes de escribir código. Los guiones están en `content/`.

## Reglas que no se rompen

1. **El niño nunca tiene que leer.** Toda instrucción se escucha. Los botones son dibujos o íconos, nunca palabras. El texto en pantalla es solo un subtítulo para adultos.
2. **Todo el audio sale de archivos MP3 pregrabados** en `public/audio/`. No uses `speechSynthesis` del navegador.
3. **Cero gastos nuevos.** No uses la API de Claude, ni servidores de pago, ni servicios que cobren. Solo GitHub, Vercel (plan Hobby) y la suscripción de ElevenLabs del dueño.
4. **Ninguna clave dentro de la app.** `ELEVENLABS_API_KEY` solo la usa `scripts/generar-voces` al construir. No puede aparecer en el código del navegador ni en el repositorio.
5. **Cada acción del niño recibe respuesta** en menos de 300 ms (sonido, animación o voz). Nunca dejes una pantalla quieta sin explicación.
6. **El micrófono es opcional.** Si no hay permiso, no hay soporte o falla dos veces, la actividad pasa a modo tocar, sin mensajes de error.
7. **Español para instrucciones, inglés para las palabras que se aprenden.** Las frases ya están escritas en los guiones; no inventes frases nuevas de Teddy sin agregarlas al guion.
8. **Objetivos táctiles de al menos 64 × 64 px** y separación de al menos 16 px. Pantalla vertical de 360 a 430 px de ancho.

## Stack

- TypeScript, React y Vite.
- PWA con `vite-plugin-pwa` (Workbox): instalable y sin internet después de la primera carga, con audios precacheados.
- Escena en SVG con React; animaciones con Framer Motion.
- Motor de lecciones: máquina de estados (XState) que lee los JSON de `content/`.
- Audio: Howler.js, con una cola de clips.
- Micrófono: Web Speech API de Chrome (`webkitSpeechRecognition`, `lang: "en-US"`).
- Datos: IndexedDB (con `idb-keyval` o `idb`).
- Pruebas: Vitest para la lógica y Playwright con viewport de celular (Pixel 7) para el recorrido completo.

## Comandos (créalos en package.json)

- `npm run dev`: servidor local.
- `npm run build`: compila la PWA.
- `npm test`: pruebas de lógica.
- `npm run e2e`: Playwright en viewport de celular.
- `npm run voces -- --dry-run`: lista los clips que faltan y cuántos caracteres costarían, sin llamar a ElevenLabs.
- `npm run voces`: genera solo los MP3 que faltan.

## Forma de trabajar

- Trabaja por fases, en el orden de `docs/ESPECIFICACION.md`, sección 12. Al terminar cada fase, **detente**, resume en español qué hiciste y cómo probarlo en el celular, y espera la aprobación.
- Antes de generar voces, ejecuta siempre `--dry-run` y muestra el total de caracteres.
- Haz commits pequeños con mensajes en español.
- Si algo de la especificación no se puede hacer, dilo y propone la alternativa más simple; no lo cambies en silencio.
