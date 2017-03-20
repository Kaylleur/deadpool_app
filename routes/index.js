const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');

/* Users */
router.get('/users',mainController.getUsers);
router.post('/users',mainController.addUsers);
router.put('/users/:id',mainController.editUsers);

/* Credit and Debit */
router.post('/credit/:id',mainController.credit);
router.post('/debit/:id',mainController.debit);

/* Route to cron for do payment every day */
router.get('/checkPayment',mainController.checkPayment);

/* initialisation of db */
router.get('/initDb',mainController.initDb);

module.exports = router;
