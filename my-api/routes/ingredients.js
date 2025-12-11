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

// DELETE //
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resDeleteIngredient = await db.query(`
        DELETE FROM ingredient 
        WHERE id_ingredient = ?`,
            id);

        let [ingredientFetch] = await db.query('SELECT * FROM ingredient WHERE id_ingredient = ?', id);

        if (ingredientFetch.length === 0) {
            ingredientFetch = "L'ingrédient avec l'id: '" + id + "' n'existe pas.";
        }

        return res.status(201).json({
            resDeleteIngredient,
            ingredientFetch
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})

module.exports = router;