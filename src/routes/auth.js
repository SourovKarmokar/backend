const express = require("express")
const router = express.Router()
const {register , login , refreshToken } = require('../controllers/authController')
const {verifyEmail} = require('../controllers/verifyEmail')
const { protect, restrictTo } = require("../middlewares/auth");
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

router.post("/register" , register)
router.get("/verify-email" , verifyEmail)
router.post("/login", login )
router.post("/refresh-token", refreshToken)

router.get("/admin/dashboard" , protect, restrictTo('admin',''))


module.exports = router