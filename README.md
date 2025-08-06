# 🚀 CRUD Básico con Express.js y PostgreSQL

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Descripción
**Proyecto educativo** de una API REST completa para gestión de usuarios con operaciones CRUD usando Express.js y PostgreSQL. 

Este proyecto está diseñado para aprender los fundamentos del desarrollo backend con Node.js, incluyendo conexión a bases de datos, validaciones, manejo de errores y buenas prácticas de desarrollo.

## 🎯 Objetivos de Aprendizaje
- Crear una API REST con Express.js
- Conectar Node.js con PostgreSQL
- Implementar operaciones CRUD completas
- Aplicar validaciones de datos
- Manejar errores de forma profesional
- Usar variables de entorno
- Estructurar un proyecto backend

## 🚀 Características
- ✅ **CRUD completo** (Create, Read, Update, Delete)
- ✅ **Validaciones de datos** (email, edad, campos requeridos)
- ✅ **Búsqueda de usuarios** por nombre o email
- ✅ **Manejo de errores** con códigos HTTP apropiados
- ✅ **Conexión a PostgreSQL** con pool de conexiones
- ✅ **Variables de entorno** para configuración
- ✅ **Documentación automática** en ruta principal
- ✅ **Respuestas estructuradas** en formato JSON
- ✅ **Triggers de base de datos** para timestamps automáticos

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Paso a paso

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/crud-basico.git
cd crud-basico
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar PostgreSQL:**
   - Crear una base de datos llamada `crud_database`
   - Ajustar las credenciales en el archivo `.env`

4. **Configurar variables de entorno:**
   
   Renombra `.env.example` a `.env` y ajusta los valores:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=crud_database
   DB_USER=postgres
   DB_PASSWORD=tu_password_aqui
   PORT=3000
   ```

5. **Crear la base de datos y tablas:**
```bash
# Conectar a PostgreSQL y ejecutar:
psql -U postgres -d crud_database -f database.sql
```

6. **Ejecutar el proyecto:**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

7. **Verificar instalación:**
   - Abrir http://localhost:3000
   - Deberías ver la documentación de la API

## 🛠️ Endpoints de la API

### 📖 Documentación Interactiva
- **`GET /`** - Documentación completa de la API

### 👥 Gestión de Usuarios

| Método | Endpoint | Descripción | Ejemplo de Uso |
|--------|----------|-------------|----------------|
| `GET` | `/usuarios` | Obtener todos los usuarios | `GET http://localhost:3000/usuarios` |
| `GET` | `/usuarios/:id` | Obtener usuario por ID | `GET http://localhost:3000/usuarios/1` |
| `POST` | `/usuarios` | Crear nuevo usuario | Ver ejemplo abajo ⬇️ |
| `PUT` | `/usuarios/:id` | Actualizar usuario existente | Ver ejemplo abajo ⬇️ |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | `DELETE http://localhost:3000/usuarios/1` |
| `GET` | `/usuarios/buscar/:termino` | Buscar usuarios | `GET http://localhost:3000/usuarios/buscar/juan` |

### 📝 Ejemplos de Uso

#### Crear Usuario (POST)
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "edad": 25,
    "telefono": "+52-555-1234"
  }'
```

#### Actualizar Usuario (PUT)
```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "edad": 26
  }'
```

### 📊 Estructura de Respuesta
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "count": 5
}
```

## 🗄️ Estructura de la Base de Datos

### Base de Datos: `crud_database`

#### Tabla: `usuarios`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre completo |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico |
| `edad` | INTEGER | - | Edad del usuario |
| `telefono` | VARCHAR(20) | - | Número telefónico |
| `fecha_creacion` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `fecha_actualizacion` | TIMESTAMP | AUTO UPDATE | Fecha de última modificación |

#### Características de la Base de Datos:
- **Índices** en email y nombre para consultas rápidas
- **Trigger automático** para actualizar `fecha_actualizacion`
- **Validaciones** a nivel de aplicación y base de datos
- **Datos de ejemplo** incluidos para testing

## 🧪 Testing y Desarrollo

### Probar la API
```bash
# Obtener todos los usuarios
curl http://localhost:3000/usuarios

# Obtener usuario específico
curl http://localhost:3000/usuarios/1

# Buscar usuarios
curl http://localhost:3000/usuarios/buscar/juan
```

### Herramientas Recomendadas
- **Postman** o **Insomnia** para testing de API
- **pgAdmin** para gestión de PostgreSQL
- **VS Code** con extensiones de Node.js

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **pg** - Driver de PostgreSQL
- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing

### Base de Datos
- **PostgreSQL** - Sistema de gestión de base de datos

### Herramientas de Desarrollo
- **nodemon** - Reinicio automático en desarrollo

## 📚 Conceptos Aprendidos

Este proyecto cubre los siguientes conceptos importantes:

### Backend Development
- ✅ Arquitectura REST
- ✅ Middleware en Express
- ✅ Manejo de rutas y parámetros
- ✅ Validación de datos
- ✅ Códigos de estado HTTP

### Base de Datos
- ✅ Conexión con pool de conexiones
- ✅ Consultas parametrizadas (SQL injection prevention)
- ✅ Transacciones básicas
- ✅ Triggers y funciones

### Buenas Prácticas
- ✅ Separación de responsabilidades
- ✅ Manejo de errores centralizado
- ✅ Configuración mediante variables de entorno
- ✅ Documentación de código
- ✅ Estructura de proyecto limpia

## 🤝 Contribuciones

Este es un proyecto educativo abierto a contribuciones. Algunas ideas para mejoras:

- [ ] Implementar autenticación JWT
- [ ] Agregar paginación a las consultas
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios
- [ ] Dockerizar la aplicación
- [ ] Agregar logging estructurado
- [ ] Implementar swagger/OpenAPI

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Proyecto educativo para aprender desarrollo backend con Node.js y PostgreSQL.

---

⭐ **¡No olvides dar una estrella si este proyecto te ayudó a aprender!** ⭐
