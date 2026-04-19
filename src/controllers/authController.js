const User = require("../models/User");
const jwt = require("jsonwebtoken");
const VerificationToken = require("../models/verificationToken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email & Password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone: phone || undefined,
      role: role || "customer",
    });

    await user.save();

    //Create verification token
    const token = uuidv4();
    await new VerificationToken({ userId: user._id, token }).save();

    //Send Email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verification URL
    const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}&email=${user.email}`
    // Mail Options
    const mailOptions = {
      from: `Multivendor Shop <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Multivendor Ecommerce Account",
      html: `
    <h2>Welcome to Our Platform</h2>
    <p>Hi ${user.name}</p>
    <p>Thank you for registration. Please verify your email:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 24 hours</p>
    <p>Best regards,<br>Team Multivendor</p>
    `,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email Send");
    } catch (error) {
      console.error("Email send error:", error);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Please login",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};
