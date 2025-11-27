var express = require('express');
var router = express.Router();
const db=require('../db/db.js');

/* Get all pizzas */
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pizza');
        res.json(rows);  // Return all pizzas as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})

/* Get pizza of the day */
router.get('/pizzadujour', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pizza ORDER BY id_pizza LIMIT 1');
        res.json(rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// get ingredient by pizza id

router.get('/:id/ingredient', async (req, res, next) => {
    try {
        const [rows] = await db.query(' select i.* from ingredient i join composer c on i.id_ingredient= c.id_ingredient where c.id_pizza =? ',
            [req.params.id]);
        res.json(rows);
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
})

/* Get pizza by id */
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pizza WHERE id_pizza = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Pizza not found');
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

module.exports = router;
