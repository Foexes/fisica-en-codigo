# Física en Código

Prototipo personal para repasar física y matemáticas conectando la notación
académica con conceptos de programación.

La interfaz y el contenido están escritos en español. La estructura interna,
los componentes, tipos, funciones y variables usan nomenclatura en inglés.

## Incluido en el prototipo 0.6

- Workspace de estudio con navegación persistente.
- Tres modos: **Entender**, **Experimentar** y **Practicar**.
- Explicación progresiva de posición, velocidad y aceleración.
- Traducción directa entre ecuaciones y GDScript.
- Selector compartido para GDScript, Luau, Java, Python y TypeScript.
- Laboratorio con presets, controles, animación y ecuación en vivo.
- Gráfica de posición respecto al tiempo y código equivalente.
- Tres problemas con datos, pistas, correcciones y progreso persistente.
- Atajos de teclado `1`, `2` y `3` para cambiar de modo.
- Diseño adaptable a escritorio y móvil.
- PWA instalable con funcionamiento sin conexión y actualizaciones automáticas.
- Segundo módulo completo de vectores: componentes, magnitud y dirección.
- Laboratorio 2D con plano cartesiano, presets, normalización y código equivalente.
- Progreso independiente por módulo con migración del progreso anterior.
- Tercer módulo completo de funciones: entrada/salida, gráficas y pendiente.
- Laboratorio de funciones lineales con evaluación, tabla de valores y código en vivo.
- Registro modular de contenido para añadir nuevas lecciones sin condicionales crecientes.

La preferencia de lenguaje se conserva localmente y se comparte entre el modo
**Entender** y la pestaña de código del laboratorio.

## Ejecutar localmente

Requiere Node.js 22 o posterior.

```powershell
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

## Verificar y compilar

```powershell
npm run build
npm run preview
```

La compilación de producción se genera en `dist/`.

## Publicar con GitHub Pages

Cada `push` a `main` activa el workflow de despliegue incluido en el repositorio.

Para el primer despliegue, abre **Settings → Pages** en GitHub y selecciona
**GitHub Actions** como fuente. La web quedará disponible en:

`https://foexes.github.io/fisica-en-codigo/`

El workflow usa el modo `pages`, configurado en `.env.pages`, para construir la
app bajo `/fisica-en-codigo/`. El desarrollo local continúa funcionando desde `/`
sin configuración adicional.

La primera visita necesita conexión. Después, el service worker conserva la interfaz
y sus recursos para poder abrir la app sin conexión. Cuando el navegador lo permita,
el botón **Instalar app** aparecerá en la cabecera.

## Estructura

```text
src/
├─ components/   Componentes visuales e interactivos
├─ data/         Contenido de conceptos y ejercicios
├─ hooks/        Integración del navegador y la instalación PWA
├─ lib/          Lógica física independiente de React
├─ App.tsx       Composición del curso y sus modos
├─ main.tsx      Punto de entrada
└─ styles.css    Sistema visual y diseño adaptable
```

## Siguiente etapa sugerida

Construir el módulo de fuerzas conectando diagramas, fuerza neta y la segunda
ley de Newton con el movimiento ya estudiado.
