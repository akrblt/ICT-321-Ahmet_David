import express from 'express';
const router = express.Router();
import db from '../db/db.js';

/**
 * @openapi
 * /ingredients:
 *   get:
 *     summary: Returns a list of all ingredients.
 *     responses:
 *       200:
 *         description: Array of all ingredients available.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ingredient'
 *       500:
 *         description: Database error.
 *
 *   post:
 *     summary: Create a new ingredient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ingredient created successfully.
 *       400:
 *         description: Name field is missing.
 *       500:
 *         description: Database error.
 *
 * /ingredients/{id}:
 *   get:
 *     summary: Returns a specific ingredient.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An ingredient object.
 *       404:
 *         description: No ingredient found.
 *       500:
 *         description: Database error.
 *
 *   patch:
 *     summary: Partially update an ingredient.
 *     description: Update the name of an ingredient. id_ingredient cannot be modified.
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
 *             $ref: '#/components/schemas/ingredient_patch'
 *     responses:
 *       200:
 *         description: Update successful.
 *       404:
 *         description: Attempted to modify primary key or other error.
 *       500:
 *         description: Database error.
 *
 *   delete:
 *     summary: Delete an ingredient.
 *     description: Removes an ingredient from the database. This will also remove it from any pizzas it was part of (Cascade).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion processed.
 *       400:
 *         description: Ingredient not found
 *       500:
 *         description: Database error.
 */

// READ //
// Read all ingredients
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredient');
        res.status(200).json(rows); // return json
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred");
    }
})

// Read ingredient by id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ingredient where id_ingredient = ?',
            [req.params.id]);
        if (rows.length === 0) return res.status(404).send("No ingredient found.");
        res.status(200).json(rows[0]);
    } catch (err){
        console.log(err);
        res.status(500).send("database error");
    }
});

/* WRITE */
/* Create ingredient */
router.post('/', async (req, res, next) => {
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

        return res.status(200).json({
            id: result.insertId,
            name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

/* Patch ingredient by id (partial update) */
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

        return res.status(200).json({
            resPatchIngredients,
            ingredient
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// Delete ingredient by id //
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let [ingredientFetch] = await db.query('SELECT * FROM ingredient WHERE id_ingredient = ?', id);

        if (ingredientFetch.length === 0) {
            ingredientFetch = "L'ingrédient avec l'id: '" + id + "' n'existe pas.";
            return res.status(400).json(ingredientFetch)
        }

        const resDeleteIngredient = await db.query(`
        DELETE FROM ingredient 
        WHERE id_ingredient = ?`,
            id);

        [ingredientFetch] = await db.query('SELECT * FROM ingredient WHERE id_ingredient = ?', id);
        if (ingredientFetch.length === 0){
            ingredientFetch = "L'ingredient avec l'id: '" + id + "' a été supprimé.";
        }

        return res.status(200).json({
            resDeleteIngredient,
            ingredientFetch
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

export default router;