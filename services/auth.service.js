import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword
  });

  return user;
};
