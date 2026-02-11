import {
  createUserByAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const userRoutes = (app) => {
  // ==================
  // USER ROUTES (ADMIN)
  // ==================

  app.post("/api/v1/users/create", protect, isAdmin, createUserByAdmin);

  app.post("/api/v1/users/list", protect, isAdmin, getAllUsers);

  app.post("/api/v1/users/detail", protect, isAdmin, getUserById);

  app.put("/api/v1/users/:id", protect, isAdmin, updateUser);

  app.delete("/api/v1/users/:id", protect, isAdmin, deleteUser);
};

export default userRoutes;
