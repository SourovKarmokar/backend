const User = require("../models/User")
const VerificationToken = require('../models/verificationToken')

exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query

    try {
        const tokenDoc = await VerificationToken.findOne({ token })

        if (!tokenDoc) {
            return res.status(400).json({
                message: "Invalid or expired token"
            })
        }

        const user = await User.findById(tokenDoc.userId)

        if (!user || user.email !== email) {
            return res.status(400).json({
                message: "Invalid request"
            })
        }

        // already verified check
        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "Email already verified"
            })
        }

        user.isEmailVerified = true
        await user.save()

        await tokenDoc.deleteOne()

        // redirect to frontend
        res.redirect(`${process.env.FRONTEND_URL}/verify-success?email=${email}`)

    } catch (error) {
        console.log("Email Verification Error", error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}