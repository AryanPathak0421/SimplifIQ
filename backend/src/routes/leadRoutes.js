import express from 'express';
import { LeadController } from '../controllers/leadController.js';

const router = express.Router();

router.post('/', LeadController.createLead);
router.get('/', LeadController.listLeads);

export default router;
