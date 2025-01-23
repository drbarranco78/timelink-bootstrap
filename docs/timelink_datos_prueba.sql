USE timelink;

-- Insertando datos de prueba

-- Empresas
INSERT INTO empresas (cif, nombre_empresa, direccion, telefono, email) VALUES
('A12345678', 'Tech Solutions', 'Calle Tecnología 123, Madrid', '912345678', 'contacto@techsolutions.com'),
('B87654321', 'Innovatech', 'Avenida Innovación 45, Barcelona', '934567890', 'info@innovatech.com');

-- Usuarios
INSERT INTO usuarios (dni, nombre, apellidos, email, cif_empresa, cargo, rol) VALUES
('12345678A', 'Juan', 'Pérez López', 'juan.perez@techsolutions.com', 'A12345678', 'Desarrollador', 'trabajador'),
('87654321B', 'María', 'Gómez Sánchez', 'maria.gomez@innovatech.com', 'B87654321', 'Gerente', 'maestro');

-- Credenciales
INSERT INTO credenciales (id_usuario, password, reset_code, reset_code_expires) VALUES
('1', 'Password123', NULL, NULL),
('2', 'Securepass456', NULL, NULL);

-- Fichajes
INSERT INTO fichajes (id_usuario, tipo_fichaje, fecha, hora, ubicacion) VALUES
('1', 'entrada', '2025-01-17', '08:00:00', 'Oficina Madrid'),
('1', 'salida', '2025-01-17', '16:00:00', 'Oficina Madrid'),
('2', 'entrada', '2025-01-17', '09:00:00', 'Oficina Barcelona'),
('2', 'inicio_descanso', '2025-01-17', '13:00:00', 'Oficina Barcelona');