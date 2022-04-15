-- CREAR DATABASE
CREATE DATABASE alwaysmusic;

-- CONECTARSE A DATABASE
\c alwaysmusic

-- CREAR ROLE
CREATE ROLE fernanditox LOGIN SUPERUSER PASSWORD 'carlospro';

-- INGRESAR A DATABASE CON ROL
psql -d alwaysmusic -U fernanditox


-- CREAR TABLA
CREATE TABLE usuario(
    nombre VARCHAR(50),
    rut VARCHAR(12) PRIMARY KEY,
    curso VARCHAR(50),
    nivel SMALLINT
);

-- PARA INGRESAR DATOS CON COMANDOS EJEMPLO
node index.js nuevo 'Felipe Jimenes' '17680646-K' Guitarra 10
