const express = require("express")
const router = express.Router();
const {protect,restrictTo} = require('../middlewares/auth');
const { approveVendor, getPendingVendors, getAllVendors, getApprovedVendors, getRejectedVendors, rejectVendor, getAdminStats } = require("../controllers/adminController");



//all admin routes protected + only admin access
route.use(protect, restrictTo('admin'))

//Vendor management routes

router.get('/vendors/pending', getPendingVendors);
router.get('/vendors/all', getAllVendors);
router.get('/vendors/approved', getApprovedVendors);
router.get('/vendors/rejected', getRejectedVendors);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);

router.get('/state', getAdminStats)

//Basic user management 
router.get('/users/all', getAllUsers);

module.exports = router;
