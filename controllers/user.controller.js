import mongoose from "mongoose";
import User from "../models/user.model.js";


// =============================
// CREATE USER (ADMIN)
// =============================
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, companyName, timezone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
        field: "email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "member",
      companyName,
      timezone,
      isEmailVerified: true,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        timezone: user.timezone,
        companyName: user.companyName,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};



// =============================
// GET ALL USERS
// =============================


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users"
    });
  }
};



// =============================
// GET SINGLE USER
// =============================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};



// =============================
// UPDATE USER
// =============================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, timezone, companyName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id);

    if (!user || user.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.role = role ?? user.role;
    user.timezone = timezone ?? user.timezone;
    user.companyName = companyName ?? user.companyName;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};



// =============================
// DELETE USER (SOFT DELETE)
// =============================


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Delete user permanently
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};
