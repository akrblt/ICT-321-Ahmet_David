import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/* Read pizza du jour */
/**
 * @openapi
 * /pizza-du-jour:
 *   get:
 *     summary: returns the pizza of the day.
 *     description: get pizza on sale with final price.
 *     responses:
 *       200:
 *         description: Returns an array of pizza's field and computed values.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/pizzadujour"
 *       500:
 *         description: system exception describing the error.
 */
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

// Create pizza du jour
/**
 * @openapi
 * /pizzadujour:
 *   post:
 *     summary: create an offer for a pizza.
 *     description: post an offer with a start and finish date for a pizza.
 *     parameters:
 *       - name: id_pizza
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *              description: returns pizza matching name
 *       - name: date_start
 *         in: body
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching description
 *       - name: date_finish
 *         in: body
 *         required: true
 *         schema:
 *              type: float
 *              description: returns pizza matching price
 *       - name: rabais
 *         in: body
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching image
 *     responses:
 *       200:
 *         description: add the offer for the pizza and return the offer info.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/promotion"
 *       400:
 *         description: exception describing all required fields
 *       500:
 *         description: system exception describing the error.
 */
router.post('/', async (req, res, next) => {
    const {id_pizza, date_start, date_finish, rabais} = req.body;
    if (!id_pizza || !date_start || !date_finish || rabais == null) {
        return res.status(400).json({
            error: "Tous les champs sont obligatoires (id_pizza, date_start, date_finish, rabais).",
        });
    }
    try {

        const[result] = await db.query('INSERT INTO promotion (id_pizza,date_start ,date_finish, rabais) VALUES (?, ?, ?, ?)', [ id_pizza, date_start, date_finish, rabais ]);

        return res.status(201).json({
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

        return res.status(201).json({
            resPatchPizzaDuJour,
            pizzadujour
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
export default router;