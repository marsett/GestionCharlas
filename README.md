# GestionCharlas - Sistema de Gestión de Charlas Tajamar

## 🚀 Descripción

Aplicación web desarrollada con Vue.js que facilita la gestión completa de charlas estudiantiles mediante un sistema de rondas de presentación. Permite a estudiantes proponer charlas, a profesores gestionar rondas y evaluar propuestas, y a administradores supervisar todo el proceso educativo.

🔗 **Ver Proyecto en Vivo** [https://charlasalumnostajamar.azurewebsites.net/login]

## 🛠️ Tecnologías Utilizadas

- **Framework:** Vue.js
- **Lenguajes:** JavaScript, HTML5, CSS3
- **Estilos:** Bootstrap, CSS personalizado
- **Calendario:** FullCalendar
- **Gráficos:** Chart.js
- **HTTP Client:** Axios
- **Iconos:** Font Awesome
- **Alertas:** SweetAlert
- **Router:** Vue Router
- **Fechas:** Moment.js
- **Cookies:** cookies-js
- **Animaciones:** vue-confetti

## ✨ Características

- ✅ **Sistema de autenticación** con roles diferenciados (Alumno, Profesor, Administrador)
- ✅ **Gestión de rondas de charlas** con fechas configurables
- ✅ **Sistema de votación** para selección de charlas
- ✅ **Calendario interactivo** con eventos de presentaciones
- ✅ **Panel de control personalizado** según el rol del usuario
- ✅ **Gestión de comentarios** en charlas
- ✅ **Sistema de recursos** adjuntos a charlas
- ✅ **Interfaz responsiva** adaptable a todos los dispositivos
- ✅ **Estados de charlas** (Propuesta, Aceptada, Rechazada)
- ✅ **Estadísticas visuales** con gráficos interactivos
- ✅ **Gestión de usuarios** y cursos

## 🎭 Roles y Funcionalidades

### 👨‍🎓 Estudiantes (ALUMNO)
- **Proponer charlas** en rondas abiertas con título, descripción, duración y recursos
- **Votar charlas** de otros estudiantes durante períodos de votación
- **Ver calendario** de presentaciones programadas
- **Gestionar perfil** personal y visualizar historial de charlas
- **Editar charlas propuestas** antes de la fecha límite
- **Comentar en charlas** para generar discusión

### 👨‍🏫 Profesores (PROFESOR)
- **Crear y gestionar rondas** con fechas de cierre y límites de votación
- **Evaluar charlas propuestas** y cambiar estados (Aceptar/Rechazar)
- **Ver estadísticas del curso** y participación de estudiantes
- **Gestionar alumnos** del curso asignado
- **Actualizar estados masivamente** basado en votaciones
- **Calendario de presentaciones** con vista completa del módulo

### 👨‍💼 Administradores (ADMINISTRADOR)
- **Gestión completa de usuarios** (profesores y estudiantes)
- **Supervisión del sistema** y resolución de conflictos
- **Acceso a todas las funcionalidades** de la plataforma
- **Gestión de cursos** y asignaciones

## 📱 Funcionalidades Principales

### 🗳️ Sistema de Votación
Los estudiantes pueden votar una sola vez por ronda durante el período habilitado. El sistema evita votos duplicados y muestra estadísticas en tiempo real.

### 📅 Gestión de Rondas
Los profesores crean rondas con:
- **Fecha de cierre** para propuestas
- **Fecha límite de votación**
- **Fecha de presentación**
- **Duración total disponible**
- **Descripción del módulo**

### 💬 Sistema de Comentarios
Funcionalidad completa de comentarios con:
- Creación y eliminación de comentarios
- Asociación a charlas específicas
- Control de autoría para edición

### 📊 Dashboard Interactivo
Panel principal personalizado que muestra:
- Estado de rondas activas
- Próximas presentaciones
- Estadísticas personales
- Calendario de eventos

## 🏗️ Estructura del Proyecto

```
GestionCharlas/
├── vuegestioncharlas/              # Frontend Vue.js
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── nav-icon.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminGestionUsuariosComponent.vue
│   │   │   ├── AlumnosCursoProfesorComponent.vue
│   │   │   ├── CharlasAlumnoComponent.vue
│   │   │   ├── CharlasComponent.vue
│   │   │   ├── CharlasDetalleComponent.vue
│   │   │   ├── FormNewCharla.vue
│   │   │   ├── FormNewRonda.vue
│   │   │   ├── FormVotacion.vue
│   │   │   ├── HomeComponent.vue
│   │   │   ├── InicioSesionComponent.vue
│   │   │   ├── MenuAdminComponent.vue
│   │   │   ├── MenuAlumnoComponent.vue
│   │   │   ├── MenuProfesorComponent.vue
│   │   │   ├── NotFoundComponent.vue
│   │   │   ├── PerfilAlumnoComponent.vue
│   │   │   ├── PerfilProfesorComponent.vue
│   │   │   ├── RegistroComponent.vue
│   │   │   └── UpdateEstadoCharlas.vue
│   │   ├── services/
│   │   │   ├── AdminService.js
│   │   │   ├── AuthService.js
│   │   │   ├── CharlasService.js
│   │   │   └── PerfilService.js
│   │   ├── assets/
│   │   │   └── [imágenes del proyecto]
│   │   ├── App.vue
│   │   ├── Global.js
│   │   ├── main.js
│   │   ├── Router.js
│   │   └── styles.css
│   ├── babel.config.js
│   ├── jsconfig.json
│   ├── package.json
│   ├── vue.config.js
│   └── README.md
└── README.md                       # Este archivo
```

## 🌐 API Backend

La aplicación consume una API .NET que proporciona endpoints para:

- **Autenticación:** Login, registro y gestión de sesiones
- **Charlas:** CRUD completo con estados y recursos
- **Rondas:** Gestión del ciclo de vida de rondas
- **Votaciones:** Sistema de votación única por ronda
- **Usuarios:** Gestión de perfiles y roles
- **Comentarios:** Sistema de comentarios en charlas

### Endpoints Principales:
- `api/charlas/*` - Gestión de charlas
- `api/rondas/*` - Gestión de rondas
- `api/votos/*` - Sistema de votación
- `api/usuarios/*` - Gestión de usuarios
- `api/comentarios/*` - Sistema de comentarios

## 🔄 Flujo de Trabajo

1. **Profesor crea ronda** con fechas específicas
2. **Estudiantes proponen charlas** hasta la fecha de cierre
3. **Período de votación** donde estudiantes votan por las mejores propuestas
4. **Evaluación del profesor** que acepta/rechaza charlas basándose en votos
5. **Presentaciones programadas** según calendario establecido

## 📈 Características Técnicas

- 🔒 **Autenticación JWT** con cookies seguras
- 📱 **Diseño responsive** con Bootstrap 5
- ⚡ **SPA (Single Page Application)** con Vue Router
- 🎨 **Interfaz moderna** con animaciones CSS
- 📊 **Visualización de datos** con Chart.js
- 📅 **Calendario interactivo** con FullCalendar
- 🍪 **Gestión de estado** con cookies
- 🚨 **Notificaciones elegantes** con SweetAlert2

## 🎯 Casos de Uso

### Flujo del Estudiante
1. **Registro/Login** en la plataforma
2. **Visualización del dashboard** con rondas activas
3. **Propuesta de charla** durante período abierto
4. **Votación** de charlas de compañeros
5. **Seguimiento** del estado de sus propuestas
6. **Participación** en charlas programadas

### Flujo del Profesor
1. **Acceso al panel de control** administrativo
2. **Creación de ronda** con parámetros específicos
3. **Supervisión** de propuestas estudiantiles
4. **Evaluación y aprobación** de charlas
5. **Gestión del calendario** de presentaciones
6. **Análisis de estadísticas** del curso

### Flujo del Administrador
1. **Gestión de usuarios** y roles
2. **Supervisión general** del sistema
3. **Resolución de conflictos** y problemas
4. **Configuración** de parámetros globales

## 🔄 Actualizaciones Recientes

**v0.1.0** (2025) - Versión inicial
- Sistema completo de gestión de charlas implementado
- Roles diferenciados con funcionalidades específicas
- Sistema de votación único por ronda
- Panel de control personalizado para cada rol
- Calendario interactivo con eventos de presentación
- Gestión completa de comentarios y recursos
- Interfaz responsive y moderna
- Integración completa con API .NET backend

---

## 👥 Equipo de Desarrollo

Desarrollado como proyecto educativo para la gestión de charlas estudiantiles en el entorno académico.