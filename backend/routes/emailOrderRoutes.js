// routes/emailRoutes.js

import express from 'express';
import { sendOrderEmail, sendAdminOrderEmail, sendGatheringEmail, sendCookingEmail, sendRefrigeratingEmail, sendOutfordeliveryEmail, sendDeliveredEmail, sendRescheduleEmail  } from '../controllers/emailOrderController.js';

const router = express.Router();

router.post('/sendOrder', sendOrderEmail);
router.post('/sendAdminOrder', sendAdminOrderEmail);
router.post('/gathering', sendGatheringEmail);
router.post('/cooking', sendCookingEmail);
router.post('/refrigerating', sendRefrigeratingEmail);
router.post('/outfordelivery', sendOutfordeliveryEmail);
router.post('/delivered', sendDeliveredEmail);
router.post('/sendRescheduleOrder', sendRescheduleEmail);


export default router;