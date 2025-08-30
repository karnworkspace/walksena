
import { Router } from 'express';
import { submitWalkInForm, testConnection, checkCustomer, getDropdownOptions, getWalkInEntries, updateWalkInForm } from '../controllers/walkInController';

const router = Router();

router.post('/submit', submitWalkInForm);
router.post('/update', updateWalkInForm);
router.get('/test-connection', testConnection);
router.get('/check-customer', checkCustomer);
router.get('/dropdown-options', getDropdownOptions);
router.get('/entries', getWalkInEntries);

export default router;
