const mysql = require('mysql2');

//connects application to MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //yourSQL username
        user: 'root',
        //your sql password
        password: 'Callie09!',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;