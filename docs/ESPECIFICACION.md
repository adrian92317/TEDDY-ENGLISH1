# Teddy English — Especificación técnica (versión 1)

Fecha: 11 de noviembre de 2026. Esta es la fuente de verdad para construir la app. Si algo aquí choca con `CLAUDE.md`, gana `CLAUDE.md`.

## 1. Qué es y para quién

- **Usuario:** Adriel, 6 años, habla español y **todavía no lee**.
- **Dispositivo:** celular Android con Chrome, en vertical. La app se instala como PWA desde Vercel.
- **Objetivo de la versión 1:** el primer arranque y **una lección completa** ("Colores y lugares": red, blue, yellow, green + in, on, under) que Adriel termine **sin que un adulto le lea nada**.
- **Modelo de interacción:** el de Synthesis Tutor. Teddy habla, el niño actúa sobre **una sola escena grande** y Teddy responde a cada acción con una escalera de ayuda. No hay listas de preguntas sueltas.

## 2. Comportamientos obligatorios (criterios de aceptación)

Salen del análisis de sesiones reales de Synthesis Tutor. Cada uno debe poder verse en un video de la app.

| # | Comportamiento | Cómo se cumple en Teddy English |
| --- | --- | --- |
| 1 | La configuración es la primera lección | `content/onboarding.json`: nombre, opinión, color de bufanda, ritmo, controles, micrófono, trofeo |
| 2 | Enseña cada control con un minijuego | Pasos tocar, arrastrar, mano de ayuda y botón listo del arranque |
| 3 | Pide opinión y tiene humor | Paso "opinion" del arranque, con respuesta para cada carita |
| 4 | El niño elige su ritmo | Paso "ritmo" (tortuga o conejo) que cambia pausas y velocidad |
| 5 | Micrófono opcional, sin bloquear | Si falla, se pasa a tocar sin mensajes de error |
| 6 | Prueba de ubicación sin castigo | Fuera de la versión 1 (solo hay una lección); ver sección 15 |
| 7 | Plan personal visible | Mapa con la lección 1 y tarjetas "próximamente" bloqueadas |
| 8 | Un solo material grande por lección | La escena del cuarto dura toda la lección |
| 9 | Calentamiento rápido | Paso `juego_rapido` |
| 10 | En el error, nombra lo que tocó | Clips de error con `{tocado}`, `{colorTocado}` y `{lugarPuesto}` |
| 11 | Diagnostica el error exacto | `dragTask` distingue pelota equivocada, lugar equivocado o ambos |
| 12 | Dice cuánto se equivocó | Para lugares: dice dónde la puso y dónde la queremos |
| 13 | Ayuda que achica la búsqueda | Nivel 2 de la escalera: brilla la zona correcta |
| 14 | Escalera de ayuda | Niveles 1 a 5 (sección 6) |
| 15 | Si falla otra vez, se va con calma | Nivel 5: "Lo practicamos más tarde" y la palabra va a repaso |
| 16 | Repite el razonamiento al acertar | `en_is_{color}_{lugar}` después de cada acierto |
| 17 | Le da la vuelta a la pregunta | Paso `donde_esta` |
| 18 | Deja elegir la dificultad | Paso `dificultad` |
| 19 | "¿Crees que ya sabes?" | Fuera de la versión 1; ver sección 15 |
| 20 | Hacer juntos | Nivel 3 de la escalera: Teddy resuelve un caso más fácil |
| 21 | Protagonismo del niño | Nombre en las frases, color de bufanda, carita del día |
| 22 | Cierre con ritual | Tocar la tarjeta, estrellas y trofeo solo si fue perfecto |

## 3. Pantalla

- **Vertical.** Arriba, alrededor del 30 % de la altura: el **panel de Teddy**, con el avatar animado (habla, celebra, piensa, se esconde), el subtítulo para adultos con la palabra en inglés resaltada y el botón 🔁 para repetir la última instrucción.
- Abajo, alrededor del 70 %: la **escena** (SVG que ocupa todo el ancho).
- **Barra inferior fija:** ✋ ayuda a la izquierda; ✓ listo a la derecha, visible solo cuando el paso lo pide; ⏸ pausa arriba a la derecha, que abre el acceso de adultos para salir.
- Sin texto como interfaz. Los íconos se dibujan en SVG dentro de la app.
- Todo el arte es **original y dibujado en código** (SVG): Teddy es un osito propio con bufanda del color elegido, más el cuarto, la cama, la caja y las pelotas. No uses personajes ni imágenes de terceros.
- Los sonidos cortos (pop, acierto, "boop" suave de error, tambor) se generan con Web Audio en código; no hacen falta archivos externos.

## 4. Recorrido del niño (versión 1)

1. **Primera vez:** pantalla de bienvenida con un botón grande ▶. Ese toque desbloquea el audio en Android. Después corre el arranque (`content/onboarding.json`).
2. **Mapa:** un camino con la tarjeta de la lección 1 y 4 tarjetas "próximamente" en gris con candado. Teddy dice el clip de bienvenida al entrar.
3. **Lección 1:** ejecuta `content/lessons/leccion-01-colores.json` paso a paso.
4. **Cierre:** tocar la tarjeta, estrellas, trofeo si fue perfecto, despedida y vuelta al mapa.
5. **Repaso:** a partir de la segunda sesión, antes de la lección, una ronda corta de `findGame` (3 rondas) con las palabras marcadas como difíciles. Usa los mismos clips.

## 5. Formato de los guiones

Cada archivo de `content/` tiene:

- `clips`: diccionario `id → { lang: "es" | "en", text, speed? }`. Cada clip es **un solo idioma** y se convierte en `public/audio/<id>.mp3`.
- `pasos`: lista de pasos con `id` y `tipo`.
- `global` (solo en lecciones): elogios, ayuda e inactividad.

### 5.1 Composición de frases

Una frase de Teddy es una **lista de ids de clips** que se reproducen en orden, con 150 ms de pausa (225 ms en ritmo lento). Ejemplo: `["es_ese_es", "w_green", "es_buscamos", "w_blue"]` suena como "Mmm, ese es *green*. Estamos buscando *blue*."

**Plantillas** dentro de los ids, que el motor reemplaza:

| Plantilla | Valor |
| --- | --- |
| `{color}` | color objetivo de la ronda |
| `{lugar}` | lugar objetivo (`in`, `on` o `under`) |
| `{tocado}` / `{colorTocado}` | color de la pelota que tocó el niño |
| `{lugarPuesto}` | zona donde soltó la pelota (si es `floor`, usar el error de "pelotaEquivocada" o solo `es_intenta`) |
| `{opcion}` / `{opcionElegida}` | opción de lugar que tocó |
| `{palabra}` | palabra del paso `speak` |
| `{elogioIngles}` | un clip al azar de `global.elogiosIngles`, sin repetir el anterior |

Si el niño acierta en menos de `global.elogioRapido.menosDeMs` ms, se agrega `en_p_fast`.

### 5.2 Tipos de paso

| Tipo | Qué hace |
| --- | --- |
| `say` | Reproduce clips. Avanza solo al terminar. |
| `feeling` / `choice` | Pregunta y muestra 2 a 4 botones con ícono. Cada opción tiene su `respuesta`. `guardaEn` escribe en el perfil. |
| `story` | Paneles en secuencia. Si un panel tiene `tocar`, espera el toque correcto (con `alAcertar` o `alFallar`). |
| `explore` | El niño toca objetos libremente; cada uno reproduce sus clips. Termina cuando todos fueron tocados. |
| `findGame` | Rondas de "toca la pelota X". Calificado. Escalera de ayuda. |
| `tpr` | Teddy da una orden física y se anima; el niño la hace y toca ✓ (habilitado tras `esperaMinimaMs`). |
| `demo` | Teddy mueve una pelota a cada zona y dice los clips. Luego tocar una zona repite su demo; ✓ para seguir. |
| `dragTask` | "Put the X ball in/on/under…". El niño arrastra. Calificado. Diagnostica el error. |
| `whereQuestion` | La pelota ya está en un lugar; el niño elige entre 3 pictogramas (in, on, under). Al tocar suena `x_{opcion}`. |
| `hideSeek` | Teddy se esconde en una zona; el niño toca dónde está. |
| `speak` | Pide decir la palabra; usa el micrófono (sección 8). |
| `correctTeddy` | Teddy describe la escena, a veces mal; el niño toca la carita feliz o triste. Si Teddy mintió, el niño arrastra la pelota al lugar real. |
| `chooseDifficulty` | "¿Quieres uno más difícil?" Si dice sí, corre `rondaExtra`. |
| `chant` | Reproduce las líneas una tras otra sobre un pulso de fondo a `bpm` (las voces generadas no siguen un tempo exacto); un tambor grande suena al tocarlo. Sin puntaje. |
| `mission` | Muestra la misión; foto opcional con `<input type="file" accept="image/*" capture="environment">`; un adulto confirma con 👍. Se puede dejar para después. |
| `close` | Tarjeta, estrellas, trofeo y despedida. |
| `tapTarget`, `dragTarget`, `tapControl`, `micTest`, `trophy` | Pasos del arranque con el mismo comportamiento que su nombre. |

### 5.3 Pasos calificados y estrellas

Solo cuentan los pasos con `calificado: true`. Se mide el porcentaje de rondas acertadas **al primer intento**. Las reglas de estrellas y trofeo están en el paso `cierre`.

## 6. Escalera de ayuda

Se aplica por ronda; el contador se reinicia en cada ronda nueva.

1. **Error 1:** reproducir los clips de `error`/`errores` (nombran lo que hizo el niño) y dejar que lo intente otra vez.
2. **Error 2:** nivel 2: achicar la búsqueda (brilla la zona o la pelota correcta).
3. **Error 3:** nivel 3: **hacerlo juntos con un caso más fácil**. En `dragTask`, Teddy mueve **otra** pelota al mismo lugar, dice `en_ball_{lugar}` y la regresa; después el niño lo intenta.
4. **Error 4:** nivel 4: devolverle la tarea completa (`es_ahora_tu` + instrucción).
5. **Error 5:** nivel 5: `es_mas_tarde`. La ronda se cierra **sin marcarla como fallo visible**, se anima la solución, y la palabra se agrega al repaso.

El botón ✋ en cualquier momento repite la instrucción (`global.ayuda` + instrucción) y sube un nivel en la escalera, sin contar como error.

Si la escalera de un paso tiene menos de 5 niveles (`donde_esta`, `escondidas`), al agotarlos se anima la solución y se sigue, como en el nivel 5.

**Lección corta:** si el niño toca la carita triste (`efecto: leccionCorta`), se saltan los pasos de `global.leccionCorta.omitirPasos`.

**Inactividad:** a los 8 s sin tocar, reproducir `global.inactividad.a8s` y hacer latir ✋; a los 30 s, `a30s` y pausar.

## 7. Audio

- Cola única de clips con Howler.js. Un clip nuevo de Teddy interrumpe la cola anterior (salvo los sonidos de acierto y error).
- **Desbloqueo en Android:** el primer toque ▶ reproduce un clip silencioso para habilitar el audio.
- **Ritmo:** "lento" usa reproducción a 0,9 y pausas de 1,5 veces; "rápido" usa 1,0.
- **Durante la voz de Teddy** la escena no se bloquea, pero los toques que llegan antes de terminar la instrucción se ignoran durante los primeros 400 ms.
- **Subtítulo:** muestra el `text` de cada clip; las palabras en inglés se resaltan.
- Precachear todos los MP3 de la lección en la PWA para que funcione sin internet.

## 8. Micrófono

- Usar `webkitSpeechRecognition` con `lang = "en-US"`, `maxAlternatives = 5`, `interimResults = false` y `continuous = false`.
- **Flujo:** reproducir la instrucción, y al terminar encender el micrófono con un indicador verde que late durante un máximo de 4 s.
- **Comparación:** normalizar a minúsculas sin puntuación. Acierta si alguna alternativa contiene una palabra de `aceptar[palabra]`. La lista es generosa a propósito: es un niño de 6 años y se premia el intento.
- **Si falla:** reproducir `reintento` hasta `intentosMaximos` veces y después `siFalla`, cuya tarea es tocar la pelota.
- **Sin soporte, sin permiso o con error de red:** reproducir `sinMicrofono` una sola vez por sesión y convertir todos los `speak` en tocar.
- **Privacidad:** el reconocimiento de Chrome envía el audio a Google para entenderlo. La app no graba ni guarda audio. Pedir el permiso solo en el paso `microfono` del arranque, con un adulto presente.

## 9. Generación de voces (`scripts/generar-voces.ts`)

- Lee **todos** los JSON de `content/` y junta los clips.
- Variables de entorno (archivo `.env`, que nunca se sube):
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID`: la voz de Teddy que eligió el dueño.
  - `ELEVENLABS_MODEL_ID`: por defecto `eleven_multilingual_v2`.
- Llamada: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128`, con el encabezado `xi-api-key` y el cuerpo `{ text, model_id, voice_settings: { stability, similarity_boost, speed } }`. Usa `speed` del clip si existe. **Antes de escribir el script, confirma los nombres de los campos en la documentación oficial de ElevenLabs.**
- Guarda en `public/audio/<id>.mp3` y escribe `public/audio/manifest.json` con id, idioma, texto y un hash del texto.
- **Solo genera lo que falta** o lo que cambió de texto (según el hash). Una petición a la vez, con reintento si responde 429.
- `--dry-run`: lista los clips pendientes y el total de caracteres, sin llamar a la API.
- **Riesgo conocido:** las palabras sueltas en inglés (`w_red`, `x_red`…) pueden sonar en español con un modelo multilingüe ("red" también es una palabra española). Genera primero solo los clips `w_*`, `x_*` y `s_*` para que el dueño los escuche. Si suenan en español, prueba fijar el idioma con `language_code: "en"` en un modelo que lo acepte, según la documentación, o pon la palabra dentro de una frase corta en inglés y recorta el audio.
- Costo de referencia: la lección 1 suma unos 4.300 caracteres y el arranque unos 1.300.

## 10. Progreso y repaso (IndexedDB)

- `perfil`: nombre, colorBufandaTeddy, ritmo, microfono ("ok", "no" o "sin-soporte"), arranqueCompletado.
- `palabras[palabra]`: aciertosPrimerIntento, errores, tiposDeActividadAcertados (conjunto) y estado.
- **Estados de una palabra:**
  - `dominada`: 3 o más tipos de actividad acertados al primer intento y sin errores en la última sesión.
  - `dificil`: llegó al nivel 5 de la escalera o tiene 2 o más errores en la sesión.
  - `practica`: el resto.
- `lecciones[id]`: completada, estrellas, trofeo y mejorPorcentaje.
- `sesiones`: fecha, minutos y pasos completados.
- `misiones`: fecha, color, foto (blob local) y confirmada.
- Todo se queda en el teléfono. No hay nube en la versión 1.

## 11. Panel de padres

- **Acceso:** mantener ⏸ presionado 3 segundos y resolver una suma de dos números de dos cifras mostrada en pantalla (un adulto la lee).
- **Muestra:** minutos por día (últimos 7 días), días seguidos, estado de cada palabra, porcentaje de aciertos al hablar, fotos de las misiones y estrellas y trofeos.
- **Ajustes:**
  - Límite diario de minutos (por defecto 20). Al llegar, Teddy se despide con `en_bye` + `es_adios` al terminar el paso actual.
  - Repetir el arranque.
  - Borrar el progreso, con confirmación.
  - Nombre del niño: avisar que las frases con "Adriel" están grabadas y que cambiarlo requiere regenerar voces.

## 12. Fases de construcción

Al terminar cada fase: detenerse, resumir y esperar la aprobación del dueño.

1. **Fase 0: base y publicación.** Proyecto Vite + React + TypeScript, PWA mínima instalable, repositorio en GitHub y despliegue en Vercel.
   - *Aprobado si:* el dueño instala la app de prueba en su Android desde la URL de Vercel.
2. **Fase 1: voces.** Script `generar-voces`, primero solo con palabras sueltas; el dueño las escucha; luego el resto.
   - *Aprobado si:* todas las palabras suenan en inglés y las frases en español suenan naturales.
3. **Fase 2: motor y lección jugable.** Motor de pasos, cola de audio, escena SVG, arrastrar con respaldo de tocar y tocar, escalera de ayuda y todos los pasos de la lección 1 **excepto** `speak` y `mission`.
   - *Aprobado si:* Adriel juega la lección completa en el celular.
4. **Fase 3: arranque, mapa, cierre y panel de padres.** Todo `onboarding.json`, el mapa, estrellas y trofeo, el repaso y el panel.
   - *Aprobado si:* el recorrido completo funciona sin que un adulto lea nada.
5. **Fase 4: micrófono y misión.** Paso `speak` con respaldo, prueba de micrófono del arranque y paso `mission` con foto local.
   - *Aprobado si:* Adriel habla y Teddy responde; sin micrófono, todo sigue funcionando.
6. **Fase 5: pulido y pruebas.** Pruebas de Playwright del recorrido, revisión de los 22 comportamientos y rendimiento en un celular de gama media (la animación no baja de 50 fps).

## 13. Publicación

- Repositorio privado `teddy-english` en GitHub. `.env` va en `.gitignore`.
- Vercel importa el repositorio y despliega cada `push` a `main`. Al terminar cada fase se abre un pull request hacia `main` y el dueño lo fusiona. Los MP3 generados **sí** se suben al repositorio (en `public/audio/`), porque la app los necesita y la clave no viaja con ellos.
- En Android: abrir la URL en Chrome, menú ⋮ y "Instalar app" (o "Agregar a la pantalla principal").

## 14. Validación con Adriel

- **Antes de la fase 2:** prueba corta de 8 dibujos ("Touch the red one", "Where is the ball? in, on o under"), con un adulto tocando el audio. Repetirla tras 2 a 3 semanas de uso.
- **Video de una sesión:** contar cuántas veces pide ayuda a un adulto. Meta: 0.
- **Retención a 7 días:** repetir la prueba sin practicar.
- **Revisión** del video contra la tabla de la sección 2.

## 15. Fuera de la versión 1

Tutor IA con la API de Claude, IA que mira las fotos, voz en vivo, corrección sonido por sonido (Azure), servidor propio, progreso en la nube, Google Play, prueba de ubicación (cuando haya 3 o más lecciones), "¿crees que ya sabes?" con prueba para saltar una lección, escritura de letras, juego de roles, juegos de sonidos y modo completo de juego con un adulto. Detalle en el documento "Teddy English — Lo que no entra en esta versión".
