import express from 'express';
import {getCheckoutIdController, getCheckoutStatusController } from "../controllers/checkoutController.js"

const router = express.Router();

router.post("/checkout", getCheckoutIdController);
router.post("/checkout/status", getCheckoutStatusController);
export default  router;
