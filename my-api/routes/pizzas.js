var express = require('express');
var router = express.Router();
const db=require('../db/db.js');

/* GET */
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
        const [rows] = await db.query('SELECT * FROM promotion WHERE active = 1');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
// post pizzadujour

router.post('/pizzadujour/create', async (req, res, next) => {
    const {id_pizza, date_start, date_finish, rabais, active} = req.body;
    if (!id_pizza || !date_start || !date_finish || active == null || rabais == null) {
        return res.status(400).json({
            error: "Les champs sont obligatoires.",
        });
    }
    try {

        const[result] = await db.query('INSERT INTO promotion (id_pizza,date_start ,date_finish, rabais, active) VALUES (?, ?, ?, ?, ?)', [ id_pizza, date_start, date_finish,rabais ,active]);

        return res.status(201).json({
            id: result.insertId,
            id_pizza,
            date_start,
            date_finish,
            rabais,
            active
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// Get ingredient by pizza id
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

/* POST */
/* Post pizza */
router.post('/create', async (req, res, next) => {
    try {
        const {name, description, prix, image, id_categorie} = req.body;
        console.log(name)
        // Validate required fields
        if (!name || !prix) {
            return res.status(400).json({
                error: "Les champs 'name' et 'prix' sont obligatoires.",
            });
        }

        const[result] = await db.query('INSERT INTO pizza (name, description, prix, image, id_categorie) VALUES (?, ?, ?, ?, ?)', [name, description, prix, image, id_categorie]);

        return res.status(201).json({
            id: result.insertId,
            name,
            prix
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

/* PATCH : partial UPDATE */
/* Patch pizza */
router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = [];
        const values = [];

        for (const key in req.body) {
            updates.push(`${key}= ?`);
            values.push(req.body[key]);
        }

        const resPatchPizza = await db.query(`
            UPDATE pizza
            SET ${updates.join(', ')}
            WHERE id_pizza = ${id}
        `, values);

        const [pizza] = await db.query('SELECT * FROM pizza WHERE id_pizza = ?', id);
            
        return res.status(201).json({
            resPatchPizza,
            pizza
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
module.exports = router;
