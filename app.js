const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: `${process.env.DB_USERNAME}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
  password: `${process.env.PASSWORD}`,
  port: 5432
});

app.use(bodyParser.json());

app.get('/vehicles', (req, res) => {
    try {
        pool.query('SELECT * FROM vehicles ORDER BY id', (err, result) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json({
                status: 'success',
                data: result.rows,
              });
            }
        });
    } catch (error) {
        console.error('Error executing query', error);
    }
});


app.get('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const checkIfExist = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

        if(checkIfExist.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Vehicle not found'
            });
        }

        pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id] ,(err, result) => {
            if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Internal Server Error');
            } else {
            res.json({
                status: 'success',
                data: result.rows[0],
            });
        }
    });
    } catch (error) {
        console.log('Error executing query', error);
    }
})

app.post('/vehicles', async (req, res) => {
    try {
        const { brand, model, year, is_available } = req.body;
        pool.query(`INSERT INTO vehicles (brand, model, year, is_available) VALUES ($1, $2, $3, $4)`, [brand, model, year, is_available] ,(err, result) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json({
                status: 'success',
                message: 'Vehicle added'
              });
            }
        });
    } catch (error) {
        console.error('Error executing query', error);
    }
});

app.put('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const checkIfExist = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

        if(checkIfExist.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Vehicle not found'
            });
        }

        const { brand, model, year, is_available } = req.body;
        pool.query(`UPDATE vehicles SET brand = $1, model = $2, year = $3, is_available = $4 WHERE id = $5`, [brand, model, year, is_available, id], (err, result) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json({
                status: 'success',
                message: 'Vehicle updated'
              });
            }
        });

    } catch (error) {
        console.error('Error executing query', error);
    }
});

app.delete('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const checkIfExist = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

        if(checkIfExist.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Vehicle not found'
            });
        }

        pool.query(`DELETE FROM vehicles WHERE id = ${id}`, (err, result) => {
            if (err) {
              console.error('Error executing query', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json({
                status: 'success',
                message: 'Vehicle deleted'
              });
            }
        });

    } catch (error) {
        console.error('Error executing query', error);
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
