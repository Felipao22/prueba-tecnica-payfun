const { Router } = require("express");
const paymentRoutes = require("./paymentRoutes");

const router = Router();

router.use("/", paymentRoutes);

module.exports = router;
