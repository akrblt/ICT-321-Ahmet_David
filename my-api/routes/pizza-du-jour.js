import express from 'express';
import db from '../db/db.js';
const router = express.Router();
/**
 * @openapi
 * components:
 * schemas:
 * promotion:
 * type: object
 * properties:
 * id_promotion:
 * type: integer
 * id_pizza:
 * type: integer
 * date_start:
 * type: string
 * format: date
 * date_finish:
 * type: string
 * format: date
 * rabais:
 * type: number
 * format: float
 * pizzadujour:
 * type: object
 * properties:
 * id_promotion:
 * type: integer
 * id_pizza:
 * type: integer
 * name:
 * type: string
 * prix:
 * type: number
 * rabais:
 * type: number
 * prix_final:
 * type: number
 * date_start:
 * type: string
 * format: date
 * date_finish:
 * type: string
 * format: date
 */

/* Read pizza du jour */
/**
 * @openapi
 * /pizza-du-jour:
 * get:
 * summary: Returns the pizza(s) of the day.
 * description: Fetches pizzas currently on promotion based on the system date.
 * responses:
 * 200:
 * description: A list of pizzas currently on sale with calculated final prices.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: "#/components/schemas/pizzadujour"
 * 500:
 * description: Database error.
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
 * /pizza-du-jour:
 * post:
 * summary: Create a new promotion for a pizza.
 * description: Add a discount for a pizza with specific start and end dates.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [id_pizza, date_start, date_finish, rabais]
 * properties:
 * id_pizza:
 * type: integer
 * date_start:
 * type: string
 * format: date
 * date_finish:
 * type: string
 * format: date
 * rabais:
 * type: number
 * responses:
 * 201:
 * description: Promotion created successfully.
 * 400:
 * description: Missing required fields.
 * 500:
 * description: Database error.
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

/**
 * @openapi
 * /pizza-du-jour/{id}:
 * patch:
 * summary: Partially update a promotion.
 * description: Modify specific fields (dates, discount amount) of an existing promotion.
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * content:
 * application/json:
 * schema:
 * $ref: "#/components/schemas/promotion"
 * responses:
 * 201:
 * description: Promotion updated successfully.
 * 400:
 * description: Invalid field or empty body.
 */
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

/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        let exists = 1
        const id = parseInt(req.params.id);
        let [pizzaFetch] = await db.query('SELECT * FROM promotion WHERE id_promotion = ?', id);

        if (pizzaFetch.length === 0) {
            pizzaFetch = "La promotion avec l'id: '" + id + "' n'existe pas.";
        }

        const resDeletePizzaDuJour = await db.query(`
        DELETE FROM promotion 
        WHERE id_promotion = ?`,
            id);

        if (exists === 1) {
            [pizzaFetch] = await db.query('SELECT * FROM promotion WHERE id_promotion = ?', id);
            if (pizzaFetch.length === 0){
                pizzaFetch = "La promotion avec l'id: '" + id + "' a été supprimée.";
            }
        }

        return res.status(201).json({
            resDeletePizzaDuJour,
            pizzaFetch
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})
export default router;