USE timelink;

-- Insertando datos de prueba

-- Empresas
INSERT INTO empresa (cif, nombre_empresa, direccion, telefono, email) VALUES
('A12345678', 'Tech Solutions', 'Calle Tecnología 123, Madrid', '912345678', 'contacto@techsolutions.com'),
('B87654321', 'Innovatech', 'Avenida Innovación 45, Barcelona', '934567890', 'info@innovatech.com');

-- Usuarios
INSERT INTO usuario (dni, nombre, apellidos, email, cif_empresa, cargo, rol) VALUES
('12345678A', 'Juan', 'Pérez López', 'juan.perez@techsolutions.com', 'A12345678', 'Desarrollador', 'trabajador'),
('87654321B', 'María', 'Gómez Sánchez', 'maria.gomez@innovatech.com', 'B87654321', 'Gerente', 'maestro');

-- Credenciales
INSERT INTO credenciales (dni_usuario, password, reset_code, reset_code_expires) VALUES
('12345678A', 'password123', NULL, NULL),
('87654321B', 'securepass456', NULL, NULL);

-- Fichajes
INSERT INTO fichaje (dni_usuario, tipo_fichaje, fecha, hora, ubicacion) VALUES
('12345678A', 'entrada', '2025-01-17', '08:00:00', 'Oficina Madrid'),
('12345678A', 'salida', '2025-01-17', '16:00:00', 'Oficina Madrid'),
('87654321B', 'entrada', '2025-01-17', '09:00:00', 'Oficina Barcelona'),
('87654321B', 'inicio_descanso', '2025-01-17', '13:00:00', 'Oficina Barcelona');