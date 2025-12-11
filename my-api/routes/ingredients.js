var express = require('express');
var router = express.Router();
const db =require('../db/db.js');

/* POST */
/* Post ingredient */
router.post('/create', async (req, res, next) => {
    try {
        const {name} = req.body;
        console.log(name)
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                error: "Le champ 'name' est obligatoire.",
            });
        }

        const[result] = await db.query('INSERT INTO ingredient (name) VALUES (?)', [name]);

        return res.status(201).json({
            id: result.insertId,
            name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// GET //
// Get all ingredients

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredient');
        res.json(rows); // return json
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }
})

// Get ingredient by id

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredient where id_ingredient = ?',
            [req.params.id]);
        if (rows.length === 0) return res.status(404).send("No ingredient found.");
        res.json(rows[0]);
    } catch (err){
        console.log(err);
        res.status(500).send("database error");
    }
});

/* PATCH : partial UPDATE */
/* Patch ingredients */
router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = [];
        const values = [];

        for (const key in req.body) {

            if (key !== 'id_ingredient') {
                updates.push(`${key}= ?`);
                values.push(req.body[key]);

            }
            else {
                return  res.status(404).send("id_ingredient ne peut pas etre modifier");
            }

        }

        const resPatchIngredients = await db.query(`
            UPDATE ingredient
            SET ${updates.join(', ')}
            WHERE id_ingredient = ${id}
        `, values);

        const [ingredient] = await db.query('SELECT * FROM ingredient WHERE id_ingredient = ?', id);

        return res.status(201).json({
            resPatchIngredients,
            ingredient
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

module.exports = router;