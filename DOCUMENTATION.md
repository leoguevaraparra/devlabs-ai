# DevLab Pro - Documentación del Proyecto

## 1. Introducción
**DevLab Pro** es un laboratorio virtual de programación interactivo diseñado para facilitar el aprendizaje de desarrollo de software. Esta aplicación permite a los estudiantes resolver ejercicios de programación con retroalimentación en tiempo real impulsada por Inteligencia Artificial y está diseñada de arquitectura a arquitectura para integrarse fluidamente con Sistemas de Gestión de Aprendizaje (LMS) como **Moodle**, funcionando como una herramienta **LTI 1.3** (Learning Tools Interoperability).

## 2. Arquitectura del Sistema
El proyecto se divide en dos espacios de trabajo / componentes principales para separar de manera escalable la lógica de presentación de la lógica de seguridad y autenticación LTI:

*   **Frontend (Aplicación Cliente):**
    *   **Tecnologías:** React, Vite, TypeScript, Tailwind CSS.
    *   **Librerías Clave:** `react-ace` (Editor de código interactivo), `@google/genai` (Integración con Gemini AI), `jwt-decode` (Decodificación de tokens).
    *   **Propósito:** Renderizar la interfaz de usuario responsiva, el editor de código, el catálogo de ejercicios y consumir y mostrar la retroalimentación de la IA.
*   **Backend (Proveedor LTI 1.3):**
    *   **Tecnologías:** Node.js, Express.
    *   **Librerías Clave:** `ltijs` (Framework especializado en LTI 1.3), `ltijs-sequelize`, `sqlite3` (Base de datos relacional ligera).
    *   **Propósito:** Manejar el puente seguro y el flujo de autenticación OIDC estandarizado requerido por LTI 1.3, establecer la confianza con Moodle, verificar firmas y encargarse del envío seguro de calificaciones (Grade Passback).

## 3. Características Principales
*   💻 **Editor Interactivo de Código:** Soporte dinámico para escribir, leer y modificar lenguajes de programación en el propio navegador, propulsado por Ace Editor.
*   🤖 **Mentor IA Basado en Gemini:** Evaluación automatizada del código del estudiante, entregando un análisis Json estricto con métricas como: nivel de completitud, calidad, rendimiento y observaciones específicas.
*   🎓 **Integración Profunda con Moodle:** Autenticación directa para estudiantes y profesores (SSO) al hacer clic en Moodle, y pase automático de calificaciones (Grade Passback) directamente al libro de notas del LMS en cuanto resuelven un ejercicio y es aprobado por la IA.
*   📱 **Diseño 100% Responsivo:** Interfaz diseñada para no perder contexto visual ni usabilidad en móviles, tablets y monitores grandes.

## 4. Evolución y Hitos Clave del Desarrollo
A lo largo de las iteraciones sobre el proyecto, abordamos sistemáticamente optimizaciones de arquitectura y de usabilidad:

### Fase 1: Interfaz, Funcionalidad y Responsive Design
*   Se construyó un layout limpio guiado por UX utilizando **Tailwind CSS**.
*   Se refactorizó todo el catálogo de la aplicación para hacerla completamente **responsiva**, implementando menús colapsables (sidebar) y reorganizando el área del editor para que fluyera dinámicamente según el tamaño de la pantalla.
*   Agregamos una batería de nuevos retos (bucles, condicionales, algoritmos intermedios) para enriquecer el aprendizaje.

### Fase 2: Robustecimiento de la Inteligencia Artificial
*   Diseñamos e integramos un Evaluador de Código conectado directamente con `@google/genai`.
*   Formulamos *prompts paramétricos* para forzar una salida JSON que permitiera mapear puntajes y métricas abstractas del modelo hacia indicadores visuales (como barras de progreso o insignias).
*   **Resolución de Cuotas:** Superamos limitaciones imprevistas de API (Resource Exhaustion) degradando amablemente a un modelo de IA más estable (`gemini-1.5-flash`), adicionando un control cuidadoso de las excepciones.

### Fase 3: Construcción de la Espina Dorsal Backend (LTI Server)
*   Elegimos construir un servidor con `ltijs` debido al elevado grado de complejidad del estándar LTI 1.3 (manejo robusto de firmas asimétricas JWK y OAuth2).
*   Conectamos el servidor a **SQLite** para persistir cómodamente nonces temporales y metadatos de acceso LMS sin el overhead de una BBDD cloud.
*   Definimos endpoints base como `/login` y `/lti` para iniciar la negociación con la plataforma educativa.

### Fase 4: Desbloqueo de Sesiones LTI (El Gran Reto de los Tokens)
*   **El Problema:** Al desplegar un prototipo final dentro de Moodle (normalmente en embebidos "iframes"), las políticas modernas antiseguimiento de los navegadores (Safari, y recientes de Chrome) bloqueaban agresivamente las cookies de tercera parte. Esto arrojaba el fatídico *Error 401 Unauthorized* o *Session Not Found*.
*   **La Solución Estructural:** Modificamos radicalmente el flujo de autenticación, prescindiendo del todo de la persistencia en Cookies.
*   Configuramos `ltijs` para emitir el **Token LTI (`ltik`)** explícitamente en la carga inicial y lo almacenamos en el front-end.
*   Refactorizamos el Front para adjuntar proactivamente el `ltik` como `Authorization: Bearer <token>` en todas las llamadas subsecuentes (API requests) a nuestro Backend, garantizando un flujo confiable y hermético, independientemente de la política de navegación local del estudiante.

### Fase 5: Retroalimentación a Moodle (Grade Passback)
*   Se levantó un endpoint autenticado exclusivo `/api/grade` dentro de nuestro Servidor Node.
*   Cada vez que la IA emite un veredicto mayor a 0 sobre el código, el Frontend dispara un llamado protegido. El servidor Node intercepta el token, descubre a qué plataforma LTI, curso y alumno pertenece, e invoca el servicio de Moodle (`lti.Grade.SubmitScore(...)`) para asentar la calificación automáticamente en el *Moodle Gradebook*.

## 5. El Despliegue en la Nube
Para que esto cobrara vida e interactuara con el LMS en el mundo real, alineamos:
*   **El Backend LTI** en PaaS escalables  cuidando que tuviera variables de encriptación críticas (`LTI_KEY`, origin CORS policy).
*   **El Frontend React/Vite** en plataformas estáticas, asegurándonos de que consumiera la URL del backend recién establecido mediante las variables de entorno `.env.local` y los redireccionamientos requeridos en SPAs (`_redirects`).

## 6. Desafíos Técnicos y Guía de Replicación/Escalabilidad

Para garantizar que esta aplicación pueda ser mantenida, replicada o escalada robustamente en el futuro, es fundamental documentar las soluciones técnicas exactas aplicadas a los problemas de integración más complejos.

### 6.1. Integración LTI 1.3 sin Cookies (Token-Based Auth)
*   **El Desafío:** El estándar LTI lanza las herramientas externas integrándolas como un `iframe` dentro de Moodle. Los navegadores actuales (Chrome en incógnito, Safari, Firefox con protecciones estrictas) bloquean por defecto las cookies de terceros, lo que destruye instantáneamente la sesión basada en cookies manejada por `ltijs`, lanzando errores *401 Unauthorized*.
*   **La Solución Técnica:**
    1.  En el Backend (`ltijs`), configuramos el servidor para que expusiera el token LTI (`ltik`) en vez de depender de establecer una cookie.
    2.  En el Frontend, un hook especializado (ej. `useLTI.ts`) intercepta y extrae este `ltik` de lado del cliente y lo persiste en el estado local de la aplicación (o `sessionStorage`).
    3.  A cada llamada subsecuente de Vite al servidor de Node, adjuntamos obligatoriamente la cabecera: `Authorization: Bearer <ltik>`.
*   **Replicación/Escalado:** Al extender la app, todo desarrollador debe respetar esta arquitectura "Stateless" (sin estado) en sus peticiones HTTP al backend, inyectando programáticamente el Bearer token siempre; nunca recurrir a dependencias de *session cookies*.

### 6.2. Cross-Origin Resource Sharing (CORS) y Seguridad
*   **El Desafío:** Asegurar que el Backend LTI acepte invocaciones del Frontend alojado en otro host totalmente diferente, pero bloqueando dominios maliciosos, durante el flujo trilateral (Moodle -> Node Backend -> Vite Frontend).
*   **La Solución Técnica:** Definición estricta de variables de entorno (como `LTI_KEY` - firmamento criptográfico de 32+ caracteres) y configuración rigurosa de CORS.
*   **Replicación/Escalado:** Para desplegar esta arquitectura en "Producción", es obligatorio usar bases de datos distribuidas en lugar de SQLite (ej. usar `ltijs-sequelize` apuntando a PostgreSQL o MySQL) para que el servidor LTI pueda escalar horizontalmente (en múltiples instancias) y aún compartir el estado de los "nonces" (parámetro de seguridad OIDC) entre nodos.

### 6.3. Sincronización de Calificaciones (Grade Passback API)
*   **El Desafío:** Devolver de forma verídica a Moodle la retroalimentación procesada por Gemini.
*   **La Solución Técnica:** Se habilitó la ruta `POST /api/grade`. El servidor Node recupera del `ltik` los objetos OIDC (`token.platformContext`) para conocer el contexto exacto. Se manda llamar el método interno `lti.Grade.SubmitScore`.
*   **Replicación/Escalado:**  El API de Moodle requiere que la calificación sea normalizada. Si la App evalúa de 0 a 100, se debe hacer el *parseo* enviando a Moodle un `score` entre `0.0` y `1.0`.

### 6.4. Inteligencia Artificial y Límites de Cuota (Rate Limits)
*   **El Desafío:** Obtener de Gemini la evaluación estricta sin agotar las cuotas de llamadas (Resource Exhaustion Error) y poder leer consistentemente su respuesta para la UI.
*   **La Solución Técnica:**
    1. Ajustar los prompts utilizando el formato *System Instructions* indicando severamente un esquema JSON, permitiendo a React parsear fácilmente datos como "nivel de éxito", "hints" o "métricas de código".
    2. Modificación dinámica del modelo consumido (`gemini-1.5-flash`) y atrapar fallos asincrónicos localizados (en caso de que la API de Google falle temporalmente o exceda usos) degradando la UI de tal manera que el estudiante pueda reintentarlo luego en vez de experimentar una pantalla blanca (Crash).
*   **Replicación/Escalado:** Cuando el campus sobrecargue a los estudiantes concurrentes evaluando código, la conexión síncrona cliente-Gemini deberá moverse eventualmente hacia una arquitectura de *Colas de Trabajos (Task Queues)* en un servidor, enviando eventos WebSockets al Front una vez la IA termine el trabajo, evadiendo así fallas por timeout del navegador.

## Conclusión
La consecución de DevLab Pro demuestra una exitosa amalgama de tecnologías modernas de Frontend conectadas al poderoso cerebro de evaluación del Gemini, todo finalmente encapsulado y validado a través de los fuertes y rigurosos estándares LTI 1.3, lo que le permite comportarse como una herramienta educativa profesional nativa dentro de un entorno institucional cerrado como lo es Moodle.
