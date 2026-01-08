import express from 'express';
import pizzasRouter from './pizzas.js';
import ingredientsRouter from './ingredients.js';
import pizzaDuJourRouter from "./pizza-du-jour.js";

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/pizza-du-jour', pizzaDuJourRouter);

// Home Page //
router.get('/', (req, res) => {
    res.render('index', { title: 'David & Ahmet' });
});

export default router;