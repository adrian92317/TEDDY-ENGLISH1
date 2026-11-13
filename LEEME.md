# Cómo poner a Fable a construir la app

Tiempo estimado: 20 minutos. Es más fácil hacerlo desde una computadora.

## 1. Sube estos archivos a GitHub

1. Entra a https://github.com/new
2. Nombre del repositorio: `teddy-english`. Márcalo como **Private**. Marca **Add a README file**. Pulsa **Create repository**.
3. En el repositorio, pulsa **Add file → Upload files**.
4. Arrastra **todo el contenido** de esta carpeta (los archivos y las carpetas `content`, `docs` y `scripts`), **excepto** `.env.example` si no quieres subirlo (no tiene claves, así que también puedes subirlo).
5. Pulsa **Commit changes**.

## 2. Ten a mano el ID de la voz de Teddy

En ElevenLabs, abre la voz que elegiste y copia su **Voice ID**. No lo pegues en el chat de Claude; va en el paso 3.

## 3. Abre Claude Code con Fable 5.2

1. Entra a https://claude.ai/code y conecta tu cuenta de GitHub si te lo pide.
2. Elige el repositorio `teddy-english`.
3. En la configuración del entorno, agrega dos **variables de entorno** (nunca en el chat):
   - `ELEVENLABS_API_KEY` = tu clave de ElevenLabs
   - `ELEVENLABS_VOICE_ID` = el Voice ID del paso 2
4. Si el entorno tiene restricciones de red, permite `api.elevenlabs.io` y el registro de npm.
5. Elige el modelo **Claude Fable 5.2**.
6. Abre `PROMPT_PARA_FABLE.md`, copia todo lo que está debajo de la línea y pégalo como primer mensaje.

## 4. Conecta Vercel (cuando Fable termine la fase 0)

1. Entra a https://vercel.com/new
2. Importa el repositorio `teddy-english` y pulsa **Deploy** (Vercel detecta Vite solo).
3. Abre la URL que te da Vercel en Chrome, en tu Android, y en el menú ⋮ toca **Instalar app**.

Desde ahí, cada cambio que Fable suba a GitHub aparece solo en la app.

## Qué hay en esta carpeta

| Archivo | Para qué |
| --- | --- |
| `PROMPT_PARA_FABLE.md` | El primer mensaje para Fable |
| `CLAUDE.md` | Reglas del proyecto que Fable lee siempre |
| `docs/ESPECIFICACION.md` | La especificación técnica completa |
| `content/onboarding.json` | Guion del primer arranque (30 frases) |
| `content/lessons/leccion-01-colores.json` | Guion completo de la lección 1 (167 frases) |
| `.env.example` | Nombres de las variables (sin claves) |
| `.gitignore` | Evita subir claves por error |
