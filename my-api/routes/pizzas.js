import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/* READ */
/* Read all pizzas */
/**
 * @openapi
 * /pizzas:
 *   get:
 *     summary: returns a list of pizzas.
 *     description: get all pizzas in the menu, filter is allowed inside query with "/pizzas?param=value"
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         schema:
 *              type: integer
 *              description: returns pizza matching id
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
 *              description: returns pizza matching description
 *       - name: prix
 *         in: query
 *         required: false
 *         schema:
 *              type: float
 *              description: returns pizza matching price
 *       - name: image
 *         in: query
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching image
 *       - name: id_categorie
 *         in: query
 *         required: false
 *         schema:
 *              type: integer
 *              description: returns pizza matching category
 *
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
        const filters = req.query;

        let sql = `
        SELECT * 
        FROM pizza 
        WHERE 1 = 1`

        let params = [];

        if (filters.id) {
            sql += " AND id_pizza = ?";
            params.push(filters.id);
        }

        if (filters.name){
            sql += " AND name LIKE ?";
            params.push(filters.name);
        }

        if (filters.description){
            sql += " AND description LIKE ?";
            params.push(filters.description);
        }

        if (filters.prix) {
            sql += " AND prix = ?";
            params.push(`%${filters.prix}%`);
        }

        if (filters.image) {
            sql += " AND image = ?";
            params.push(`%${filters.image}%`);
        }

        if (filters.id_categorie) {
            sql += " AND id_categorie = ?";
            params.push(`%${filters.id_categorie}%`);
        }

        const [rows] = await db.query(sql, params);
        res.status(200).json(rows);  // Return all pizzas as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
})

// Read pizza by id
/**
 * @openapi
 * /pizzas/:id:
 *   get:
 *     summary: returns the pizza selected.
 *     description: get pizza with id in query.
 *     responses:
 *       200:
 *         description: Returns the body of a pizza.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/pizza"
 *       500:
 *         description: system exception describing the error.
 */
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await db.query(' select p.* from pizza p where p.id_pizza =? ',
            [req.params.id]);
        res.json(rows);
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
})

// Read ingredients by pizza id
/**
 * @openapi
 * /pizzas/:id/ingredients:
 *   get:
 *     summary: returns the ingredients of the pizza.
 *     description: get ingrdients of the pizza in query.
 *     responses:
 *       200:
 *         description: Returns an array of ingredients.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/ingredient"
 *       500:
 *         description: system exception describing the error.
 */
router.get('/:id/ingredients', async (req, res, next) => {
    try {
        const [rows] = await db.query(' select i.* from ingredient i join composer c on i.id_ingredient= c.id_ingredient where c.id_pizza =? ',
            [req.params.id]);
        res.json(rows);
    } catch (err){
        console.error(err);
        res.status(500).send('Database error');
    }
})

/* WRITE */
/* Create pizza */
/**
 * @openapi
 * /pizzas:
 *   post:
 *     summary: create a pizza.
 *     description: post a pizza.
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *              type: string
 *              description: returns pizza matching name
 *       - name: description
 *         in: query
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching description
 *       - name: prix
 *         in: query
 *         required: true
 *         schema:
 *              type: float
 *              description: returns pizza matching price
 *       - name: image
 *         in: query
 *         required: false
 *         schema:
 *              type: string
 *              description: returns pizza matching image
 *       - name: id_categorie
 *         in: query
 *         required: false
 *         schema:
 *              type: integer
 *              description: returns pizza matching category
 *     responses:
 *       200:
 *         description: add the pizza and return the pizza info.
 *         content:
 *             application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/pizza"
 *       400:
 *         description: exception describing all required fields
 *       500:
 *         description: system exception describing the error.
 */
router.post('/', async (req, res, next) => {
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
