import express from 'express';
import db from '../db/db.js';
const router = express.Router();

/**
 * @openapi
 * components:
 * schemas:
 * pizza:
 * type: object
 * properties:
 * id_pizza:
 * type: integer
 * name:
 * type: string
 * description:
 * type: string
 * prix:
 * type: number
 * format: float
 * image:
 * type: string
 * id_categorie:
 * type: integer
 */

/* READ */
/* Read all pizzas */

/**
 * @openapi
* /pizzas:
* get:
* summary: Returns a list of pizzas.
* description: Get all pizzas in the menu. Supports filtering via query parameters.
* parameters:
* - name: id
* in: query
* schema:
* type: integer
* - name: name
* in: query
* schema:
* type: string
* responses:
* 200:
* description: Array of pizzas.
* content:
* application/json:
* schema:
* type: array
* items:
* $ref: "#/components/schemas/pizza"
* */
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
 * /pizzas/{id}:
 * get:
 * summary: Returns a specific pizza.
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: A pizza object.
 * 404:
 * description: Pizza not found.
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
 * /pizzas/{id}/ingredients:
 * get:
 * summary: Returns ingredients for a pizza.
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: List of ingredients.
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
 * post:
 * summary: Create a new pizza.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [name, prix]
 * properties:
 * name: { type: string }
 * description: { type: string }
 * prix: { type: number }
 * image: { type: string }
 * id_categorie: { type: integer }
 * responses:
 * 201:
 * description: Pizza created successfully.
 * 400:
 * description: Missing required fields.
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

/**
 * @openapi
 * /pizzas/{id}:
 * patch:
 * summary: Partially update a pizza.
 * description: Update specific fields of a pizza. Cannot modify 'id_pizza'.
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
 * $ref: "#/components/schemas/pizza"
 * responses:
 * 201:
 * description: Update successful.
 * 400:
 * description: Invalid field or empty body.
 */
/* Patch pizza (partial update) */
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

/**
 * @openapi
 * /pizzas/{id}:
 * delete:
 * summary: Delete a pizza.
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * 201:
 * description: Pizza deleted (status 201 used in current code).
 * 500:
 * description: Database error.
 */
/* DELETE */
router.delete('/:id', async (req, res) => {
    try {
        let exists = 1
        const id = parseInt(req.params.id);
        let [pizzaFetch] = await db.query('SELECT * FROM pizza WHERE id_pizza = ?', id);

        if (pizzaFetch.length === 0) {
            pizzaFetch = "La pizza avec l'id: '" + id + "' n'existe pas.";
        }

        const resDeletePizza = await db.query(`
        DELETE FROM pizza 
        WHERE id_pizza = ?`,
        id);

        if (exists === 1) {
            [pizzaFetch] = await db.query('SELECT * FROM pizza WHERE id_pizza = ?', id);
            if (pizzaFetch.length === 0){
                pizzaFetch = "La pizza avec l'id: '" + id + "' a été supprimée.";
            }
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
