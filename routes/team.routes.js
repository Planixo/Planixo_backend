import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const teamRoutes = (app) => {
  // Admin Only

  app.post("/api/v1/teams", protect, isAdmin, createTeam);

  app.get("/api/v1/teams", protect, isAdmin, getAllTeams);

  app.get("/api/v1/teams/:id", protect, isAdmin, getTeamById);

  app.put("/api/v1/teams/:id", protect, isAdmin, updateTeam);

  app.delete("/api/v1/teams/:id", protect, isAdmin, deleteTeam);
};

export default teamRoutes;
