const express = require('express');
const router = express.Router();
const { createTender, getTender, updateTender, getTenderById, deleteTender } = require('../controllers/tenderController');

const { isAuthenticated, authorizeRoles } = require('../middleware/Auth');
const society = require('../controllers/SocietyController')
router.post('/create', isAuthenticated,authorizeRoles('admin'),createTender);
// 


router.get('/gettender', getTender);

router.get('/get/tender/:id', getTenderById);

router.put('/update',isAuthenticated,authorizeRoles('admin'), updateTender);



router.get('/tenders/society',isAuthenticated,authorizeRoles('society'),society.getUserTenders);
router.post('/society-tenders',isAuthenticated,society.getSocietyTenders);
router.delete('/delete/:id', isAuthenticated,authorizeRoles('admin'),deleteTender);

// router.delete('/delete/:id', isAuthenticated,authorizeRoles('admin'),deleteTender);

module.exports = router;