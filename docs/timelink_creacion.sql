-- Elimina la base de datos si existe
DROP DATABASE IF EXISTS timelink;

-- Creación de la base de datos TimeLink
CREATE DATABASE IF NOT EXISTS timelink DEFAULT CHARACTER SET utf8; 
USE timelink;

-- Tabla Empresa
CREATE TABLE IF NOT EXISTS empresas (
	id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    cif VARCHAR(15) UNIQUE NOT NULL,
    nombre_empresa VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(15),
    email VARCHAR(100)
);

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS usuarios (    
	id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(9) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cif_empresa VARCHAR(15) NOT NULL,
    cargo VARCHAR(50),
    rol ENUM('maestro', 'trabajador') NOT NULL,
    FOREIGN KEY (cif_empresa) REFERENCES empresas(cif)
	ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla Credenciales
CREATE TABLE IF NOT EXISTS credenciales (
    id_credencial INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    password VARCHAR(255) NOT NULL,
	reset_code VARCHAR(100),
    reset_code_expires DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
	ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla Fichaje
CREATE TABLE IF NOT EXISTS fichajes (
    id_fichaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_fichaje ENUM('entrada', 'salida', 'inicio_descanso', 'fin_descanso') NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
	ON UPDATE CASCADE ON DELETE CASCADE
);
