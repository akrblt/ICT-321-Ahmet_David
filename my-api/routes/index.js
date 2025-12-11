import express from 'express';
import pizzasRouter from './pizzas.js';
import ingredientsRouter from './ingredients.js';

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

// Home Page //
router.get('/', (req, res) => {
    res.render('index', { title: 'David & Ahmet' });
});

export default router;