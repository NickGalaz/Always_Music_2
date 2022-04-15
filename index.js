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

const overmind = async (condicion, nombre, rut, curso, nivel) => {
    pool.connect(async (error_conexion, client, release) => {

        switch (condicion) {
            case "nuevo":
                if (error_conexion)
                    return console.error(error_conexion.code);
                try {
                    const insert = 'INSERT INTO usuario (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *';
                    const params = [nombre, rut, curso, nivel];
                    const SQLQuery = {
                        text: insert,
                        values: params
                    };
                    const res = await client.query(SQLQuery);
                    console.log("Alumno agregado con éxito!")
                    console.log(res.rows[0]);
                } catch (error_consulta) {
                    console.log("Alumno no fue agregado...")
                    console.log('error_conexion.messages: ', error_consulta.message)
                    release();
                    pool.end();
                    return console.error('error_consulta.code: ', error_consulta.code);
                }
                break;
            case "consulta":
                if (error_conexion)
                    return console.error(error_conexion.code);
                try {
                    const select = 'SELECT * FROM usuario';
                    const SQLQuery = {
                        rowMode: 'array',
                        text: select,
                    };
                    const res = await client.query(SQLQuery);
                    console.log(res.rows);
                } catch (error_consulta) {
                    console.log('error_conexion.messages: ', error_consulta.message)
                    release();
                    pool.end();
                    return console.error('error_consulta.code: ', error_consulta.code);
                }
                break;
            case "editar":
                if (error_conexion)
                    return console.error(error_conexion.code);
                try {
                    const edit = 'UPDATE usuario SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2 RETURNING *';
                    const params = [nombre, rut, curso, nivel];
                    const SQLQuery = {
                        name: 'Consulta General',
                        rowMode: 'array',
                        text: edit,
                        values: params
                    };
                    const res = await client.query(SQLQuery);
                    console.log('Cantidad de registros afectados: ', res.rowCount);
                    if (res.rows[0] == undefined) {
                        console.log("Error al editar...");
                        release();
                        return pool.end();
                    };
                    console.log("Alumno editado con éxito!")
                    console.log(res.rows[0]);

                } catch (error_consulta) {
                    console.log('error_conexion.messages: ', error_consulta.message)
                    release();
                    pool.end();
                    return console.error('error_consulta.code: ', error_consulta.code);
                }
                break;
            case "rut":
                if (error_conexion)
                    return console.error(error_conexion.code);
                try {
                    const sel = 'SELECT * FROM usuario WHERE rut = $1';
                    const params = [nombre];
                    const SQLQuery = {
                        name: 'Consulta Rut',
                        text: sel,
                        values: params
                    };
                    const res = await client.query(SQLQuery);
                    if (res.rows[0] == undefined) {
                        console.log("Alumno no encontrado...");
                        release();
                        return pool.end();
                    };
                    console.log("Alumno encontrado!")
                    console.log(res.rows[0]);

                } catch (error_consulta) {
                    console.log('error_conexion.messages:', error_consulta.message)
                    release();
                    pool.end();
                    return console.error('error_consulta.code: ', error_consulta.code);
                }
                break;
            case "eliminar":
                if (error_conexion)
                    return console.error(error_conexion.code);
                try {
                    const del = 'DELETE FROM usuario WHERE rut = $1 RETURNING *;';
                    const params = [nombre];
                    const SQLQuery = {
                        text: del,
                        values: params
                    };
                    const res = await client.query(SQLQuery);
                    console.log('Cantidad de registros afectados', res.rowCount);
                    
                    if (res.rowCount == 0) {
                        console.log("No se ha eliminado ningún alumno...")
                        release();
                        return pool.end();
                    };
                    console.log(`El alumno de RUT ${nombre} ha sido borrado!`)
                } catch (error_consulta) {
                    console.log("Error en la consulta")
                    console.error('error_consulta.message: ', error_consulta.message);
                    release();
                    pool.end();
                    return console.error('error_consulta.code: ', error_consulta.code);
                };
                break;
            default:
                console.log("Utilice uno de los siguientes comandos (nuevo, consulta, editar, rut o eliminar) seguidos del valor.")
                break;
        }
        release();
        pool.end();
    });

};

overmind(condicion, nombre, rut, curso, nivel);