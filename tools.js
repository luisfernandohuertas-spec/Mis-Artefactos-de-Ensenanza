// tools.js — Manifiesto de herramientas.
// Para publicar una herramienta nueva: agrega un objeto al arreglo TOOLS
// con su carpeta real dentro de /tools/. No hace falta tocar el HTML ni el CSS.
// Se carga como <script>, no con fetch(), así que también funciona abriendo
// index.html directamente desde el disco (sin servidor local).

const CATEGORIES = [
  { name: "Ecuaciones diferenciales", color: "#6FB8AE" },
  { name: "Cálculo", color: "#E8B94F" },
  { name: "Mecánica clásica", color: "#C97B84" },
  { name: "Ondas", color: "#7FA8D9" },
  { name: "Álgebra lineal", color: "#A897D9" },
  { name: "Astronomía y física atómica", color: "#8FB08A" },
  { name: "Vectores y geometría", color: "#E0A868" },
];

const TOOLS = [
  {
    slug: "campo-direccional",
    title: "Campo direccional (EDO de primer orden)",
    category: "Ecuaciones diferenciales",
    description: "Traza curvas solución con integración RK4 sobre un campo de pendientes interactivo.",
    path: "tools/edo/campo-direccional/index.html",
  },
  {
    slug: "plano-de-fase",
    title: "Plano de fase (sistemas lineales 2×2)",
    category: "Ecuaciones diferenciales",
    description: "Análisis de valores propios y trayectorias por RK4 para sistemas dinámicos lineales.",
    path: "tools/edo/plano-de-fase/index.html",
  },
  {
    slug: "edo-lineal-primer-orden",
    title: "EDO lineal de primer orden con condición inicial",
    category: "Ecuaciones diferenciales",
    description: "y' + p(x)y = q(x): curva solución sobre el campo de pendientes, con punto inicial ajustable y casos preestablecidos.",
    path: "tools/edo/edo-lineal-primer-orden/index.html",
  },
  {
    slug: "integral-punto-medio",
    title: "Integral definida — regla del punto medio",
    category: "Cálculo",
    description: "Compara Mₙ contra un valor de referencia por regla de Simpson, con error absoluto y relativo.",
    path: "tools/calculo/integral-punto-medio/index.html",
  },
  {
    slug: "longitud-de-arco",
    title: "Longitud de arco",
    category: "Cálculo",
    description: "Diagrama de transportador arrastrable que resalta el arco y calcula su longitud en grados y radianes.",
    path: "tools/calculo/longitud-de-arco/index.html",
  },
  {
    slug: "leyes-de-newton",
    title: "Leyes de Newton",
    category: "Mecánica clásica",
    description: "Primera y segunda ley con fuerzas editables y ΣF en vivo; tercera ley comparando aceleraciones de dos bloques.",
    path: "tools/mecanica/leyes-de-newton/index.html",
  },
  {
    slug: "mcu-simulador",
    title: "Movimiento circular uniforme",
    category: "Mecánica clásica",
    description: "Radio, velocidad lineal y tiempo controlan una animación con vector de velocidad tangente y contador de vueltas.",
    path: "tools/mecanica/mcu-simulador/index.html",
  },
  {
    slug: "gravitacion",
    title: "Ley de gravitación universal",
    category: "Mecánica clásica",
    description: "F = Gm₁m₂/r² con esferas a escala logarítmica, vectores de fuerza y presets desde dos personas hasta Tierra-Sol.",
    path: "tools/mecanica/gravitacion/index.html",
  },
  {
    slug: "cubeta-de-ondas",
    title: "Cubeta de ondas (FDTD 2D)",
    category: "Ondas",
    description: "Solución numérica de la ecuación de onda con reflexión, refracción, difracción de una y dos rendijas.",
    path: "tools/ondas/cubeta-de-ondas/index.html",
  },
  {
    slug: "onda-en-cuerda",
    title: "Onda en una cuerda (v = √(T/μ))",
    category: "Ondas",
    description: "Onda viajera o estacionaria animada, con gráficas de v contra T y v contra μ marcando el punto de operación.",
    path: "tools/ondas/onda-en-cuerda/index.html",
  },
  {
    slug: "mapa-conceptual-ondas",
    title: "Mapa conceptual: ondas",
    category: "Ondas",
    description: "Árbol interactivo de 24 nodos sobre fenómenos ondulatorios, cada uno con un diagrama SVG propio.",
    path: "tools/ondas/mapa-conceptual-ondas/index.html",
  },
  {
    slug: "sistemas-2x2",
    title: "Sistemas 2×2 por regla de Cramer",
    category: "Álgebra lineal",
    description: "Resuelve sistemas lineales 2×2 y muestra la solución de forma gráfica.",
    path: "tools/algebra-lineal/sistemas-2x2/index.html",
  },
  {
    slug: "multiplicacion-de-matrices",
    title: "Multiplicación de matrices paso a paso",
    category: "Álgebra lineal",
    description: "Esquema de Falk para matrices 2×2 a 4×4 con navegación de pasos y sustitución término a término.",
    path: "tools/algebra-lineal/multiplicacion-de-matrices/index.html",
  },
  {
    slug: "leyes-de-kepler",
    title: "Leyes de Kepler",
    category: "Astronomía y física atómica",
    description: "Órbitas elípticas reales para los ocho planetas, sectores de áreas iguales y gráfica log-log T contra a.",
    path: "tools/astronomia/leyes-de-kepler/index.html",
  },
  {
    slug: "modelo-atomico-3d",
    title: "Modelo atómico 3D",
    category: "Astronomía y física atómica",
    description: "Tabla periódica completa con configuración electrónica real por capa y núcleo en empaquetamiento cúbico.",
    path: "tools/atomico/modelo-atomico-3d/index.html",
  },
  {
    slug: "vectores-3d",
    title: "Suma y resta de vectores en 3D",
    category: "Vectores y geometría",
    description: "Marco de referencia cúbico interactivo con renderizado por algoritmo del pintor.",
    path: "tools/geometria/vectores-3d/index.html",
  },
  {
    slug: "curva-parametrica-3d",
    title: "Curvas paramétricas en 3D",
    category: "Vectores y geometría",
    description: "r(t) = (x(t), y(t), z(t)) con vectores de velocidad y aceleración, cámara orbital y presets como la hélice y el nudo de trébol.",
    path: "tools/geometria/curva-parametrica-3d/index.html",
  },
  {
    slug: "graficador-de-funciones",
    title: "Graficador de funciones",
    category: "Vectores y geometría",
    description: "Analizador de expresiones propio, sin librerías externas, para graficar funciones arbitrarias.",
    path: "tools/geometria/graficador-de-funciones/index.html",
  },
];
