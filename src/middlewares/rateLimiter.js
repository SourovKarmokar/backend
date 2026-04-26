const rateLimit = require("express-rate-limit");

// 🔹 base config (reuse)
const baseConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
};

// 🔹 Register limiter
const registerLimiter = rateLimit({
  ...baseConfig,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many registration attempts, try again after 15 minutes",
    });
  },
});

// 🔹 Login limiter
const loginLimiter = rateLimit({
  ...baseConfig,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, try again later",
    });
  },
});

// 🔹 Refresh token limiter
const refreshLimiter = rateLimit({
  ...baseConfig,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many token refresh attempts",
    });
  },
});

// 🔹 General API limiter
const apiLimiter = rateLimit({
  ...baseConfig,
  max: 100,
});

module.exports = {
  registerLimiter,
  loginLimiter,
  refreshLimiter,
  apiLimiter,
};