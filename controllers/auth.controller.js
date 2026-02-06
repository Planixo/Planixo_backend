import { createUser } from "../services/auth.service.js";
import { validateSignup } from "../validators/auth.validator.js";

export const signup = async (req, res) => {
  try {
    const error = validateSignup(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error
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
        role: user.role
      }
    });
  } catch (err) {
    const statusCode =
      err.message === "Email already registered" ? 409 : 500;

    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};
