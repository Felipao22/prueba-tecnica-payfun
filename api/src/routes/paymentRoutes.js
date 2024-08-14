const { Router } = require('express');
const checkoutPaymentController = require('../controllers/paymentController');

const router = Router();

router.post("/payment_single", checkoutPaymentController);

module.exports = router