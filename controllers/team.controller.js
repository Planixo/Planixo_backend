import Team from "../models/team.model.js";
import User from "../models/user.model.js";

// =======================
// CREATE TEAM
// =======================
export const createTeam = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Team name and members are required",
      });
    }

    const team = await Team.create({
      name,
      createdBy: req.user._id,
      members,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// GET ALL TEAMS
// =======================
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate("members.user", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// GET TEAM BY ID
// =======================
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members.user", "name email role");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// UPDATE TEAM
// =======================
export const updateTeam = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// DELETE TEAM
// =======================
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
