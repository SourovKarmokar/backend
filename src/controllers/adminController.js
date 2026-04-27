const { success } = require("zod");
const User = require("../models/User");

exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      status: "pending",
    }).select(
      "name email shopName shopAddress nidNumber createdAt"
    );

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    })
  }
}

exports.getAllVendors = async (req,res) => {
  try {
    const vendors = await User.find({
      role: 'vendor',
    }).select(' name email shopName status shopAddress approvedAt rejectedAt rejectReason nidNumber createdAt ');

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    })

  } catch (error) {
    console.error("All Vendors Error:", error);

    res.status(500).json({
      success: false,
      message: 'server error'
    })
  }
}

exports.getApprovedVendors = async (req,res) => {
  try {
    const vendors = await User.find({
      role: 'vendor',
      status: 'approved'
    }).select(' name email shopName shopAddress nidNumber approvedAt createdAt ')
    
    res.status(200).json({
      success: true,
      count: vendors.length,
      data : vendors
    })

  } catch (error) {
    console.error("Approved Vendors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getRejectedVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      status: "rejected",
    }).select(
      "name email shopName shopAddress rejectReason createdAt"
    );

    return res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });

  } catch (error) {
    console.error("Rejected Vendors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await User.findById(vendorId);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // 🔒 already approved check
    if (vendor.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor is already approved",
      });
    }

    // ✅ approve vendor
    vendor.status = "approved";
    vendor.approvedAt = new Date();

    await vendor.save();

    // TODO: send approval email

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
    });
  } catch (error) {
    console.error("Approve Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while approving vendor",
    });
  }
};


exports.rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const vendor = await User.findOneAndUpdate(
      { _id: vendorId, role: "vendor", status: "pending" },
      {
        status: "rejected",
        rejectReason: reason,
        approvedAt: null,
        rejectedAt: new Date(),
      },
      { new: true }
    ).select("name email shopName status rejectReason rejectedAt");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or already processed",
      });
    }

    // TODO: send rejection email with reason

    return res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
      data: vendor,
    });

  } catch (error) {
    console.error("Reject Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("name email role status createdAt")
      .skip(skip)
      .sort({createdAt: -1})
      .limit(limit);
      

    const total = await User.countDocuments();

    return res.status(200).json({
      success: true,
      page,
      total,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};