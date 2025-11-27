var express = require('express');
var router = express.Router();



var pizzasRouter = require('./pizzas');
var ingredientsRouter = require('./ingredients');

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter)

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'David & Ahmet' });
});

module.exports = router;
