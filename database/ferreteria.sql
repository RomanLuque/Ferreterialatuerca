CREATE DATABASE IF NOT EXISTS ferreteria 
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ferreteria;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('cliente','mayorista') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

use ferreteria;

select * from usuarios;