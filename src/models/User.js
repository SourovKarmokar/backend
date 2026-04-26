const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: 2
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: "customer"
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshTokens: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
        }
    }],

    shopName: {
        type: String,
        unique: true,
    },

    shopDescription: {
        type: String,
        trim: true,
        maxLength:1000
    },

    shopAddress: {
        type: String,
        trim: true,
    },

    shopLogo: {
        type: String,
    },

    nidNumber: {
        type: String,
        unique: true,
        sparse: true,
    },

    bankInfo: {
        bankName: String,
        brunchName: String,
        accountNumber: String,
        accountHolder: String,
    },

    statis: {
        type: String,
        enum: ['pending', 'approved','rejected','suspended'],
        default: 'customer'
    },
    approvedAt: {
        type: Date
    },

    rejectReason: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    },



}, { timestamps: true })

// Password Hash
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


userSchema.pre("save", function (next) {
  // role change হলে বা new user হলে run করো
  if (this.isModified("role") || this.isNew) {
    
    if (this.role === "vendor") {
      this.status = "pending"; // vendor approval needed
    } else {
      this.status = "customer"; // normal user
      this.shopName = undefined; // vendor field remove
    }

  }

  next();
});




// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)