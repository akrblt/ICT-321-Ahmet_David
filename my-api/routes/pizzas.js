import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/* GET */
/* Get all pizzas */

/**
 * @openapi
 * /pizzas:
 *   get:
 *     summary: returns a list of pizzas.
 *     description: get all pizzas in the menu
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching name
 *       - name: description
 *         in: query
 *         required: false
 *         schema:
 *              type: string
 *              description: returns
 *     responses:
 *       200:
 *         description: Returns an array of pizzas.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/pizza"
 *       500:
 *         description: system exception describing the error.
 */

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
        const [rows] = await db.query('SELECT pi.id_pizza, pi.name, pi.prix, pr.rabais, (pi.prix - pr.rabais) AS prix_total, pr.date_start, pr.date_finish\n' +
            'FROM promotion pr\n' +
            'INNER JOIN pizza pi\n' +
            'ON pr.id_pizza = pi.id_pizza \n' +
            'WHERE CURDATE() BETWEEN pr.date_start AND pr.date_finish;');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
router.get('/pizzadujour/nom', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pi.name
             FROM promotion pr
             INNER JOIN pizza pi 
                ON pr.id_pizza = pi.id_pizza
             WHERE CURDATE() BETWEEN pr.date_start AND pr.date_finish
             LIMIT 1;`
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune pizza du jour active" });
        }

        res.json({ nom: rows[0].name });

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});


router.get('/pizzadujour/prix', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                pi.prix AS prix_original,
                pr.rabais AS rabais,
                (pi.prix - pr.rabais) AS prix_total
             FROM promotion pr
             INNER JOIN pizza pi 
                ON pr.id_pizza = pi.id_pizza
             WHERE CURDATE() BETWEEN pr.date_start AND pr.date_finish
             LIMIT 1;`
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune pizza du jour active" });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

router.get('/pizzadujour/ingredients', async (req, res) => {
    try {

        const [promo] = await db.query(
            `SELECT pi.id_pizza
             FROM promotion pr
             INNER JOIN pizza pi 
                ON pr.id_pizza = pi.id_pizza
             WHERE CURDATE() BETWEEN pr.date_start AND pr.date_finish
             LIMIT 1;`
        );

        if (promo.length === 0) {
            return res.status(404).json({ message: "Aucune pizza du jour active" });
        }

        const id_pizza = promo[0].id_pizza;


        const [ingredients] = await db.query(
            `SELECT ing.name
             FROM composer c
             INNER JOIN ingredient ing 
                ON c.id_ingredient = ing.id_ingredient
             WHERE c.id_pizza = ?;`,
            [id_pizza]
        );

        res.json({
            id_pizza,
            ingredients: ingredients.map(i => i.name)
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
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
            if (key !== "id_pizza"){        /* empêcher de modifier l'id */
                updates.push(`${key}= ?`);
                values.push(req.body[key]);
            } else {
                return res.status(400).json({
                    error: "Le champ 'id_pizza' ne peut pas être modifié.",
                });
            }
        }

        if (updates.length === 0) {         /* empêcher le patch vide */
            return res.status(400).json({
                error: "Aucun champ valide à mettre à jour.",
            });
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

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resDeletePizza = await db.query(`
        DELETE FROM pizza 
        WHERE id_pizza = ?`,
        id);

        let [pizzaFetch] = await db.query('SELECT * FROM pizza WHERE id_pizza = ?', id);

        if (pizzaFetch.length === 0) {
            pizzaFetch = "La pizza avec l'id: '" + id + "' n'existe pas.";
        }

        return res.status(201).json({
            resDeletePizza,
            pizzaFetch
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})

export default router;
