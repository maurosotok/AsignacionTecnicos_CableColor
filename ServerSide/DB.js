import {createPool} from 'mysql2/promise' //CREATE POOL es para tener varios hilos de conexiones, sql2/promise es para el async, que espera una promesa

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Fatimacotto1.',
    port: '3306',
    database: 'companydb' 
})

