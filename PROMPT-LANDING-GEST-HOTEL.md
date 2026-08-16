# Prompt: Landing page promocional para Gest-Hotel

> Copia y pega este texto como prompt en tu asistente de IA (Claude, ChatGPT, etc.) para generar la landing page promocional del proyecto.

---

Eres un diseñador y desarrollador frontend senior. Quiero que crees una **landing page promocional** moderna, profesional y completamente responsive para **Gest-Hotel**, un sistema web (SPA) de gestión hotelera. El contenido debe estar en **español**, usando un tono claro, profesional y orientado a beneficios para el cliente.

## Contexto del producto

Gest-Hotel es una aplicación web de gestión hotelera que centraliza todo el día a día de un hotel: reservas, habitaciones, clientes, anticipos, facturación y administración del negocio. Es un sistema multi-empresa y multi-centro (soporta hoteles con varias sedes o centros de operación), con inicio de sesión por usuario y control de accesos por perfiles.

## Funcionalidades reales del sistema (debes reflejarlas en la landing)

1. **Reservas y estadías**: crear, editar, confirmar y cancelar reservas; check-in/check-out; estados de reserva (reservada, pendiente de confirmar, ingresada, cancelada); finalizar estadía con facturación directa.
2. **Calendario de reservas**: vista mensual interactiva por habitación (FullCalendar), con colores por estado de cada reserva y resumen diario de entradas/salidas.
3. **Gestión de habitaciones**: registro y control de habitaciones por tipo (sencilla, doble, suite, etc.), con estados como disponible, en limpieza, ocupada y en mantenimiento.
4. **Clientes**: base de datos de clientes con tipos de documento (cédula, NIT, cédula de extranjería, tarjeta de identidad, pasaporte).
5. **Anticipos y pagos**: registro de anticipos por reserva y pagos en efectivo o transferencia, con cuentas bancarias configuradas.
6. **Servicios adicionales**: cargar consumos y servicios extra a una reserva.
7. **Facturación**: generación de facturas al finalizar la estadía, con secuencias de facturación configurables.
8. **Dashboard "Mi hotel"**: indicadores del día (pendientes, entradas, salidas, canceladas), estado de ocupación por centro y gráficos.
9. **Administración**: gestión de usuarios y perfiles con permisos, centros de operación, tipos de habitación, cuentas bancarias y secuencias de numeración.
10. **Cuenta propia**: perfil del usuario y cambio de contraseña.

## Audiencia objetivo

Propietarios, administradores y recepcionistas de hoteles, hostales y posadas pequeñas o medianas que hoy gestionan con Excel, papel o sistemas anticuados. Personas que valoran la sencillez y el control de su negocio desde cualquier dispositivo con internet.

## Estructura sugerida de la landing (puedes mejorarla)

1. **Navbar** fija con logo, enlaces de anclaje y botón "Ingresar" / "Comenzar".
2. **Hero**: titular potente (ej. "Gestiona tu hotel desde un solo lugar"), subtítulo con el valor principal, botones CTA ("Solicitar demo" / "Ver funcionalidades") y una imagen/ilustración de la aplicación (mockup de dashboard o calendario).
3. **Banda de confianza**: métricas o indicadores (ej. "Reservas en segundos", "Control 24/7", "Multi-centro").
4. **Funcionalidades**: sección con tarjetas (íconos + título + descripción corta) para las 10 funcionalidades descritas arriba. Agruparlas si es útil.
5. **Beneficios / Por qué Gest-Hotel**: comparación o lista de ventajas frente a Excel/papel: todo en un solo sistema, ocupación visible en tiempo real, menos errores de cobro, control de anticipos y facturación.
6. **Cómo funciona**: 3 pasos simples (crea tu cuenta → configura habitaciones y centros → empieza a reservar).
7. **Tecnología / seguridad**: mención breve de que es una aplicación web moderna, segura (sesión con acceso por usuario y perfiles) y disponible en cualquier navegador.
8. **CTA final**: banner con botón de solicitud de demo o contacto.
9. **Footer**: nombre del producto, enlaces, copyright.

## Diseño y estilo

- **Paleta de colores**: usa los colores institucionales del sistema: azul índigo `#3B5998`, verde esmeralda `#10B981` y celeste `#0EA5E7`, sobre fondo blanco/gris muy claro. Puedes usar degradados sutiles azul→celeste en el hero y acentos verdes en los CTAs.
- **Tipografía**: una fuente moderna y legible (por ejemplo Inter, Plus Jakarta Sans o Poppins) para títulos y cuerpo.
- **Estilo**: limpio, corporativo-hotelero, con mucho espacio en blanco, esquinas redondeadas, sombras suaves y micro-interacciones (hover) sutiles. Evitar exceso de animaciones.
- **Responsive**: debe verse bien en móvil, tablet y escritorio (menú hamburguesa en móvil).
- **Idioma**: 100% español (español de Latinoamérica).

## Restricciones técnicas

- Implementar como una página web estática: **HTML + CSS/Tailwind CSS y JavaScript** (o React + Vite si se pide), sin backend.
- Código limpio, comentado solo donde aporte, y sin dependencias pesadas ni imágenes externas de stock (usar SVGs inline o iconos de librería gratuita como Lucide o Heroicons).
- SEO básico: `<title>`, meta description y etiquetas semánticas (`header`, `main`, `section`, `footer`).
- Nombres de clases en inglés, textos visibles en español.

## Entregable

- Un único archivo o set de archivos con la landing completa.
- Al final, resume brevemente qué secciones creaste y cómo se puede personalizar (colores, textos, enlaces del CTA).