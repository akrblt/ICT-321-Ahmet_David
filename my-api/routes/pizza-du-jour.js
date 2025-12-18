import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/**
 * @openapi
 * /pizza-du-jour:
 *   get:
 *     summary: Returns the pizza of the day
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pizzadujour'
 *       500:
 *         description: Database error.
 *
 *   post:
 *     summary: Create a new promotion for a pizza.
 *     description: Add a discount for a pizza with specific start and end dates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pizza
 *               - date_start
 *               - date_finish
 *               - rabais
 *             properties:
 *               id_pizza:
 *                 type: integer
 *               date_start:
 *                 type: string
 *                 format: date
 *               date_finish:
 *                 type: string
 *                 format: date
 *               rabais:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promotion created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Database error.
 *
 * /pizza-du-jour/{id}:
 *   patch:
 *     summary: Partially update a promotion.
 *     description: Modify specific fields (dates, discount amount) of an existing promotion.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/promotion_patch'
 *     responses:
 *       200:
 *         description: Promotion updated successfully.
 *       400:
 *         description: Invalid field or empty body.
 *       500:
 *         description: Database error.
 *
 *   delete:
 *     summary: Delete a promotion.
 *     description: Remove a specific promotion offer by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the promotion to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully processed the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resDeletePizzaDuJour:
 *                   type: object
 *                   description: The raw response from the database.
 *                 pizzaFetch:
 *                   type: string
 *                   description: Confirmation message.
 *       400:
 *         description: Promotion not found
 *       500:
 *         description: Database error.
 */

/* READ */
/* Read pizza du jour */
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT pr.id_promotion, pi.id_pizza, pi.name, pi.prix, pr.rabais, (pi.prix - pr.rabais) AS prix_final, pr.date_start, pr.date_finish\n' +
            'FROM promotion pr\n' +
            'INNER JOIN pizza pi\n' +
            'ON pr.id_pizza = pi.id_pizza \n' +
            'WHERE CURDATE() BETWEEN pr.date_start AND pr.date_finish;');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

/* Read parameters */
router.get('/nom', async (req, res) => {
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


router.get('/prix', async (req, res) => {
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

router.get('/ingredients', async (req, res) => {
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

// Create pizza du jour
router.post('/', async (req, res, next) => {
    const {id_pizza, date_start, date_finish, rabais} = req.body;
    if (!id_pizza || !date_start || !date_finish || rabais == null) {
        return res.status(400).json({
            error: "Tous les champs sont obligatoires (id_pizza, date_start, date_finish, rabais).",
        });
    }
    try {

        const[result] = await db.query('INSERT INTO promotion (id_pizza,date_start ,date_finish, rabais) VALUES (?, ?, ?, ?)', [ id_pizza, date_start, date_finish, rabais ]);

        return res.status(200).json({
            id: result.insertId,
            id_pizza,
            date_start,
            date_finish,
            rabais
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

/* Patch pizza du jour (partial update) */
router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates = [];
        const values = [];

        for (const key in req.body) {
            if (key !== "id_promotion"){        /* empêcher de modifier l'id */
                updates.push(`${key}= ?`);
                values.push(req.body[key]);
            } else {
                return res.status(400).json({
                    error: "Le champ 'id_promotion' ne peut pas être modifié.",
                });
            }
        }

        if (updates.length === 0) {         /* empêcher le patch vide */
            return res.status(400).json({
                error: "Aucun champ valide à mettre à jour.",
            });
        }

        const resPatchPizzaDuJour = await db.query(`
            UPDATE promotion
            SET ${updates.join(', ')}
            WHERE id_promotion = ${id}
        `, values);

        const [pizzadujour] = await db.query('SELECT * FROM promotion WHERE id_promotion = ?', id);

        return res.status(200).json({
            resPatchPizzaDuJour,
            pizzadujour
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
        let [pizzaFetch] = await db.query('SELECT * FROM promotion WHERE id_promotion = ?', id);

        if (pizzaFetch.length === 0) {
            pizzaFetch = "La promotion avec l'id: '" + id + "' n'existe pas.";
            return res.status(400).json(pizzaFetch)
        }

        const resDeletePizzaDuJour = await db.query(`
        DELETE FROM promotion 
        WHERE id_promotion = ?`,
            id);

        [pizzaFetch] = await db.query('SELECT * FROM promotion WHERE id_promotion = ?', id);
        if (pizzaFetch.length === 0){
            pizzaFetch = "La promotion avec l'id: '" + id + "' a été supprimée.";
        }

        return res.status(200).json({
            resDeletePizzaDuJour,
            pizzaFetch
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})
export default router;