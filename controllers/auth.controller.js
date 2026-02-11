import { createUser, loginUser } from "../services/auth.service.js";
import { validateSignup } from "../validators/auth.validator.js";

// ===============================
// Helper: Cookie Options
// ===============================
const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction, // true only on HTTPS
    sameSite: isProduction ? "none" : "lax", // important for cross-domain
    maxAge,
  };
};

// ===============================
// SIGNUP
// ===============================
export const signup = async (req, res) => {
  try {
    const error = validateSignup(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR 👉", err.message);

    const statusCode =
      err.message === "Email already registered" ? 409 : 500;

    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await loginUser(req.body);

    // Set cookies
    res
      .cookie(
        "accessToken",
        accessToken,
        getCookieOptions(15 * 60 * 1000) // 15 mins
      )
      .cookie(
        "refreshToken",
        refreshToken,
        getCookieOptions(7 * 24 * 60 * 60 * 1000) // 7 days
      )
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ===============================
// LOGOUT
// ===============================
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
