const express = require("express")
const router = express.Router()
const {register , login , refreshToken, registerVendor, logout, logoutAll } = require('../controllers/authController')
const {verifyEmail} = require('../controllers/verifyEmail')
const { protect, restrictTo } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { registrationSchema, loginSchema, vendorValidationSchema } = require("../validations/auth.validation");
const { registerLimiter, loginLimiter, refreshLimiter } = require("../middlewares/rateLimiter");
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user (customer or vendor)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sourov
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [customer, vendor]
 *                 example: customer
 *     responses:
 *       201:
 *         description: User registration successful
 *       400:
 *         description: Bad request
 */

router.post("/register" , registerLimiter , validate(registrationSchema) , register)
router.get("/verify-email" ,validate(loginSchema), verifyEmail)
router.post("/login", loginLimiter , login )
router.post("/logout" , logout )
router.post("/logout-all" , logoutAll )
router.post("/refresh-token", refreshLimiter , refreshToken)
router.post('/register-vendor' , registerLimiter, validate(vendorValidationSchema),registerVendor)

router.get("/admin/dashboard" , protect, restrictTo('admin',''))


module.exports = router