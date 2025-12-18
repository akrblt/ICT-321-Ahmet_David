import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/* Get pizza of the day */
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

export default router;