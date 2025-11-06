var express = require('express');
var router = express.Router();

/* Toutes les pizzas */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

/* Pizza du jour */
router.get('/pizzadujour', function(req, res, next) {
    res.send('respond with a resource');
});

/* Pizza par id */
router.get('/:id', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
