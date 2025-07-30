
import { Router } from 'express';
import { submitWalkInForm, testConnection, checkCustomer, getDropdownOptions } from '../controllers/walkInController';

const router = Router();

router.post('/submit', submitWalkInForm);
router.get('/test-connection', testConnection);
router.get('/check-customer/:phoneNumber', checkCustomer);
router.get('/dropdown-options', getDropdownOptions);

export default router;
