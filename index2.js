const { Pool } = require('pg');
const argumentos = process.argv.slice(2);

let condicion = argumentos[0];
let nombre = argumentos[1];
let rut = argumentos[2];
let curso = argumentos[3];
let nivel = argumentos[4];


const config = {
    user: 'fernanditox',
    host: 'localhost',
    database: 'alwaysmusic',
    password: 'carlospro',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
}

const pool = new Pool(config);

// REGISTRO DE ALUMNOS
const ingresar = async (nombre, rut, curso, nivel, client) => {
    try {
        const insert = 'INSERT INTO usuario (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *';
        const params = [nombre, rut, curso, nivel];
        const SQLQuery = {
            text: insert,
            values: params
        };
        const res = await client.query(SQLQuery);
        console.log("Alumno agregado con éxito!")
        console.log(res.rows);
    } catch (error_consulta) {
        console.log("Usuario no fue agregado")
        console.error('error_consulta.message: ', error_consulta.message);
        release();
        pool.end();
        return console.error('error_consulta.code: ', error_consulta.code);
    };
}

// CONSULTA GENERAL DE ALUMNOS
const consulta = async (client) => {
    const select = 'SELECT * FROM usuario';
    const SQLQuery = {
        rowMode: 'array',
        text: select
    };
    const res = await client.query(SQLQuery);
    console.log("Consulta General realizada con éxito!")
    console.log(res.rows);
}

// ACTUALIZACIÓN DE ALUMNOS
const editar = async (nombre, rut, curso, nivel, client) => {
    const insert = 'UPDATE usuario SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2 RETURNING *';
    const params = [nombre, rut, curso, nivel];
    const SQLQuery = {
        name: 'Consulta General',
        rowMode: 'array',
        text: insert,
        values: params
    };
    const res = await client.query(SQLQuery);
    console.log('Cantidad de registros afectados: ', res.rowCount);
    console.log("Alumno editado con éxito!")
    console.log(res.rows[0]);
}

// CONSULTA RUT DE ALUMNO
const consultaRUT = async (nombre, client) => {
    const edit = 'SELECT * FROM usuario WHERE rut = $2';
    const params = [nombre, rut, curso, nivel];
    const SQLQuery = {
        name: 'Consulta Rut',
        text: edit,
        values: params
    };
    const res = await client.query(SQLQuery);
    console.log("Consulta de alumno realizada con éxito!!")
    console.log(res.rows[0]);
}

// ELIMINAR ALUMNO
const eliminar = async (rut, client) => {
    const del = 'DELETE FROM usuario WHERE rut = $1 RETURNING *;';
    const params = [rut];
    const SQLQuery = {
        rowMode: 'array',
        text: del,
        values: params
    };
    const res = await client.query(SQLQuery);
    console.log('Cantidad de registros afectados: ', res.rowCount);
    console.log(`La persona: ${res.rows[0][0]} ha sido eliminada.`);
}

// FUNCION Y COMANDOS
const overmind = async (condicion, nombre, rut, curso, nivel) => {
    pool.connect(async (error_conexion, client, release) => {
        try {
            if (error_conexion)
                return console.error(error_conexion.code);
            switch (condicion) {
                case "nuevo":
                    await ingresar(nombre, rut, curso, nivel, client);
                    break;
                case "consulta":
                    await consulta(client);
                    break;
                case "editar":
                    await editar(nombre, rut, curso, nivel, client);
                    break;
                case "rut":
                    await consultaRUT(nombre, client);
                    break;
                case "eliminar":
                    await eliminar(nombre, client);
                    break;
                default:
                    console.log("Ingresar un inicio valido porfavor (nuevo, consulta, editar, rut o eliminar)")
                    break;
            }
        } catch (error) {
            console.log("Error en la consulta...")
            console.log(error)
            release();
            pool.end();
        }
    });
};

overmind(condicion, nombre, rut, curso, nivel);