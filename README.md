# Física en Código

Prototipo personal para repasar física y matemáticas conectando la notación
académica con conceptos de programación.

La interfaz y el contenido están escritos en español. La estructura interna,
los componentes, tipos, funciones y variables usan nomenclatura en inglés.

## Incluido en el prototipo 0.4

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

La preferencia de lenguaje se conserva localmente y se comparte entre el modo
**Entender** y la pestaña de código del laboratorio.

## Ejecutar localmente

Requiere Node.js.

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
├─ hooks/        Integración del navegador y la instalación PWA
├─ lib/          Lógica física independiente de React
├─ App.tsx       Composición de la primera lección
├─ main.tsx      Punto de entrada
└─ styles.css    Sistema visual y diseño adaptable
```

## Siguiente etapa sugerida

Convertir las lecciones y los problemas en datos independientes de la interfaz,
para añadir vectores, funciones y fuerzas sin duplicar componentes.
