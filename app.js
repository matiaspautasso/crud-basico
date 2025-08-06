/**
 * CRUD Básico - Proyecto Educativo
 * 
 * Este archivo contiene una API REST completa para gestión de usuarios
 * usando Express.js y PostgreSQL. Incluye todas las operaciones CRUD,
 * validaciones, manejo de errores y buenas prácticas.
 * 
 * Autor: Tu Nombre
 * Versión: 1.0.0
 * Licencia: MIT
 */

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Función para verificar conexión a la base de datos
const verificarConexion = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release();
    } catch (error) {
        console.error('❌ Error de conexión a PostgreSQL:', error.message);
    }
};

// Middleware para manejo de errores
const manejarError = (res, error, mensaje = 'Error interno del servidor') => {
    console.error('Error:', error);
    res.status(500).json({ 
        error: mensaje, 
        details: error.message 
    });
};

// RUTAS DEL CRUD

// 📄 Ruta de inicio - Documentación de la API
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API CRUD de Usuarios',
        version: '1.0.0',
        endpoints: {
            'GET /usuarios': 'Obtener todos los usuarios',
            'GET /usuarios/:id': 'Obtener usuario por ID',
            'POST /usuarios': 'Crear nuevo usuario',
            'PUT /usuarios/:id': 'Actualizar usuario',
            'DELETE /usuarios/:id': 'Eliminar usuario'
        },
        ejemplo_usuario: {
            nombre: 'Juan Pérez',
            email: 'juan@email.com',
            edad: 25,
            telefono: '+52-555-1234'
        }
    });
});

// 📋 READ - Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios ORDER BY id ASC'
        );
        
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        manejarError(res, error, 'Error al obtener usuarios');
    }
});

// 🔍 READ - Obtener un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ 
                error: 'ID debe ser un número válido' 
            });
        }

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        manejarError(res, error, 'Error al obtener usuario');
    }
});

// ➕ CREATE - Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, edad, telefono } = req.body;

        // Validaciones básicas
        if (!nombre || !email) {
            return res.status(400).json({ 
                error: 'Nombre y email son obligatorios' 
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                error: 'Email debe tener un formato válido' 
            });
        }

        if (edad && (isNaN(edad) || edad < 0 || edad > 120)) {
            return res.status(400).json({ 
                error: 'Edad debe ser un número entre 0 y 120' 
            });
        }

        const result = await pool.query(
            `INSERT INTO usuarios (nombre, email, edad, telefono) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [nombre, email, edad || null, telefono || null]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Error de clave única (email duplicado)
            return res.status(409).json({ 
                error: 'El email ya está registrado' 
            });
        }
        manejarError(res, error, 'Error al crear usuario');
    }
});

// ✏️ UPDATE - Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, edad, telefono } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ 
                error: 'ID debe ser un número válido' 
            });
        }

        // Verificar si el usuario existe
        const usuarioExiste = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (usuarioExiste.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        // Validaciones
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                error: 'Email debe tener un formato válido' 
            });
        }

        if (edad && (isNaN(edad) || edad < 0 || edad > 120)) {
            return res.status(400).json({ 
                error: 'Edad debe ser un número entre 0 y 120' 
            });
        }

        // Construir la consulta dinámicamente
        const campos = [];
        const valores = [];
        let contador = 1;

        if (nombre !== undefined) {
            campos.push(`nombre = $${contador}`);
            valores.push(nombre);
            contador++;
        }
        if (email !== undefined) {
            campos.push(`email = $${contador}`);
            valores.push(email);
            contador++;
        }
        if (edad !== undefined) {
            campos.push(`edad = $${contador}`);
            valores.push(edad);
            contador++;
        }
        if (telefono !== undefined) {
            campos.push(`telefono = $${contador}`);
            valores.push(telefono);
            contador++;
        }

        if (campos.length === 0) {
            return res.status(400).json({ 
                error: 'Debe proporcionar al menos un campo para actualizar' 
            });
        }

        valores.push(id);
        const consulta = `
            UPDATE usuarios 
            SET ${campos.join(', ')} 
            WHERE id = $${contador} 
            RETURNING *
        `;

        const result = await pool.query(consulta, valores);

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Error de clave única
            return res.status(409).json({ 
                error: 'El email ya está registrado' 
            });
        }
        manejarError(res, error, 'Error al actualizar usuario');
    }
});

// 🗑️ DELETE - Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ 
                error: 'ID debe ser un número válido' 
            });
        }

        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        manejarError(res, error, 'Error al eliminar usuario');
    }
});

// 🔍 BÚSQUEDA - Buscar usuarios por nombre o email
app.get('/usuarios/buscar/:termino', async (req, res) => {
    try {
        const { termino } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM usuarios 
             WHERE nombre ILIKE $1 OR email ILIKE $1 
             ORDER BY id ASC`,
            [`%${termino}%`]
        );

        res.json({
            success: true,
            count: result.rows.length,
            termino_busqueda: termino,
            data: result.rows
        });
    } catch (error) {
        manejarError(res, error, 'Error en la búsqueda');
    }
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        available_routes: [
            'GET /',
            'GET /usuarios',
            'GET /usuarios/:id',
            'POST /usuarios',
            'PUT /usuarios/:id',
            'DELETE /usuarios/:id',
            'GET /usuarios/buscar/:termino'
        ]
    });
});

// Iniciar el servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Documentación disponible en http://localhost:${PORT}`);
    await verificarConexion();
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando servidor...');
    await pool.end();
    console.log('✅ Conexiones cerradas');
    process.exit(0);
});
