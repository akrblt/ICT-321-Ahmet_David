var express = require('express');
var router = express.Router();
const db =require('../db/db.js');


// get all ingredients

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredient');
        res.json(rows); // return json
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }
})

// get ingredient by id

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

module.exports = router;