const express = require("express")
const router = express.Router()
const {register , login , refreshToken } = require('../controllers/authController')
const {verifyEmail} = require('../controllers/verifyEmail')
const { restrictTo } = require("../middlewares/auth")

router.post("/register" , register)
router.get("/verify-email" , verifyEmail)
router.post("/login", login )
router.post("/refresh-token", refreshToken)

router.get("/admin/dashboard" , protect, restrictTo('admin',''))


module.exports = router