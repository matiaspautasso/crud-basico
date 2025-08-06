-- Creación de la base de datos
CREATE DATABASE crud_database;

-- Usar la base de datos
\c crud_database;

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    edad INTEGER,
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, edad, telefono) VALUES
('Juan Pérez', 'juan.perez@email.com', 25, '+52-555-1234'),
('María García', 'maria.garcia@email.com', 30, '+52-555-5678'),
('Carlos López', 'carlos.lopez@email.com', 28, '+52-555-9012'),
('Ana Martínez', 'ana.martinez@email.com', 22, '+52-555-3456'),
('Luis Rodríguez', 'luis.rodriguez@email.com', 35, '+52-555-7890');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nombre ON usuarios(nombre);

-- Función para actualizar la fecha de modificación automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE TRIGGER trigger_actualizar_fecha_modificacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();
