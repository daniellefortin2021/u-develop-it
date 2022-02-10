const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//api/candidates endpoint
router.get('/candidates', (req,res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

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
router.get('/candidates/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_9d = parties.id
                WHERE candidates.id = ?`;
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

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });

//Create a candidate
//body populates candidates data
router.post('/candidates', ({ body }, res) => {
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

//delete a candidate
router.delete('/candidates/:id', (req,res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    
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

module.exports = router;