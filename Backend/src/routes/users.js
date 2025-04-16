const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middlewares/middleware");

// Standard response format helper
const formatResponse = (data, message = "") => ({
  success: true,
  data,
  message
});

// create a new user
router.post("/", async (req, res, next) => {
  try {
    const errors = middleware.validateUserInput(req);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: "Validation failed"
      });
    }
    // check if email already exists
    const existingUser = await db.getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json(formatResponse(null, "Email already exists"));
    }
    const newUser = await db.createUser(req.body);
    res.status(201).json(formatResponse(newUser, "User created"));
  } catch (error) {
    next(error);
  }
});

// get user by id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    const user = await db.getUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }
    return res.status(200).json(formatResponse(user));
  } catch (error) {
    next(error);
  }
});

//reset user password
router.post("/:id/reset-password", middleware.validateRequestInput, async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json(formatResponse(null, "Password is required"));
    }
    
    const userForUpdate = await db.getUserById(parseInt(req.params.id));
    if (!userForUpdate) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }

    const email = userForUpdate.email;

    const userUpdated = await db.resetPassword(email, password);
    if (!userUpdated) {
      return res.status(404).json(formatResponse(null, "password update failed"));
    }
    return res.status(200).json(formatResponse(user, "Password reset successfully"));
  } catch (error) {
    next(error);
  }
});

// login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(formatResponse(null, "Email and password are required"));
    }
    
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }

    if (user.password !== password) {
      return res.status(401).json(formatResponse(null, "Invalid password"));
    }

    return res.status(200).json(formatResponse(user, "Login successful"));
  } catch (error) {
    next(error);
  }
}
);

module.exports = router;
