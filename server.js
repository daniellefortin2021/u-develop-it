const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

//adding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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


//test to see if connection is working
app.get('/', (req,res) => {
    res.json({
        message: 'Hello World'
    });
});

//return all data in the candidates tables
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

//return a single candidate from the candidates table
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// })

//delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

//route to handle user requests that aren't supported by the app - should be last GET route
app.use((req,res) => {
    res.status(404).end();
});

//adds server to PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});