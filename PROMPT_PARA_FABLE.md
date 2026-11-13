Copia todo lo que está debajo de la línea y pégalo como primer mensaje en Claude Code, con el modelo Claude Fable 5.2.

---

Vas a construir **Teddy English**, una app web instalable (PWA) para que mi hijo Adriel, de 6 años, que todavía no sabe leer, aprenda inglés en mi celular Android.

Antes de escribir código:

1. Lee completos `CLAUDE.md`, `docs/ESPECIFICACION.md`, `content/onboarding.json` y `content/lessons/leccion-01-colores.json`.
2. Respóndeme en español, en pocas líneas:
   - qué vas a construir en la **fase 0**;
   - cualquier punto de la especificación que te parezca contradictorio, imposible o arriesgado, con tu propuesta;
   - qué necesitas de mí para empezar.

Reglas para todo el proyecto:

- Trabaja **por fases**, en el orden de la sección 12 de la especificación. Al terminar cada fase, detente, dime exactamente cómo probarla en mi celular y **espera mi aprobación** antes de seguir.
- **Cero gastos nuevos:** nada de la API de Claude ni de servicios de pago. Solo GitHub, Vercel Hobby y mi suscripción de ElevenLabs.
- La clave de ElevenLabs está en la variable de entorno `ELEVENLABS_API_KEY` y la voz en `ELEVENLABS_VOICE_ID`. **Nunca** las escribas en el código, en el repositorio ni en el chat.
- Antes de generar voces, ejecuta siempre el modo `--dry-run` y dime cuántos caracteres va a gastar.
- Las frases de Teddy ya están escritas en los guiones. Si necesitas una frase nueva, agrégala al guion y avísame.
- Adriel no lee: si en algún momento la app necesita que lea, es un error.
- La meta de la versión 1 es que Adriel complete el arranque y la lección 1 **sin que un adulto le lea nada**.

Empieza leyendo los archivos.
