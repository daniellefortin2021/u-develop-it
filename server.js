const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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

//return all data in the candidates tables (wrapped in an express route)
//api/candidates endpoint
app.get('/api/candidates', (req,res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            //sends s tatus code and an error message within JSON object
            res.status(500).json({ error: err.message });
            return;
        }
        //sends repsonse as JSON object to the browser
        res.json({
            message:'success',
            data: rows
        });
    });
});

//return a single candidate from the candidates table in an express route
// getting by value of id only
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    //will only call query from table with matching id
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//delete a candidate
app.delete('/api/candidates/:id', (req,res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,result) => {
        if(err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//Create a candidate
//body populats candidates data
app.post('/api/candidates', ({ body }, res) => {
    //dustructing to pull the boyd property out of the request object
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status (400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
})

//route to handle user requests that aren't supported by the app - should be last GET route
app.use((req,res) => {
    res.status(404).end();
});

//adds server to PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});