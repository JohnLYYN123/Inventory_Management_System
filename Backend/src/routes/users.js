const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const middleware = require("../middlewares/middleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcrypt = require("bcrypt");
const { default: jwtTokenAuthentication } = require("../middlewares/jwtMiddleware");

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

    // generate a token for the new user
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    const retData = {
      identity: newUser, 
      token: token
    }

    res.status(201).json(formatResponse(retData, "User created"));
  } catch (error) {
    next(error);
  }
});

// get user by email
router.get("/:email", async (req, res, next) => {
  try {
    const userEmail = req.params.email;
    const user = await db.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }
    return res.status(200).json(formatResponse(user));
  } catch (error) {
    next(error);
  }
});

//reset user password
router.post("/:id/reset-password", jwtMiddleware.jwtTokenAuthentication ,async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json(formatResponse(null, "Password is required"));
    }

    console.log("user id", req.params.id);
    
    const userForUpdate = await db.getUserById(parseInt(req.params.id));
    if (!userForUpdate) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }

    const email = userForUpdate.email;
    console.log("user email", email);

    const userUpdated = await db.resetPassword(email, password);
    console.log("user updated", userUpdated);
    if (!userUpdated) {
      return res.status(404).json(formatResponse(null, "password update failed"));
    }
    return res.status(200).json(formatResponse(userUpdated, "Password reset successfully"));
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

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json(formatResponse(null, "Invalid password"));
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    const retData = {
      identity: user, 
      token: token
    }

    return res.status(200).json(formatResponse(retData, "Login successful"));
  } catch (error) {
    next(error);
  }
}
);

//edit user profile
router.put("/:email/edit", jwtMiddleware.jwtTokenAuthentication ,async (req, res, next) => {
  try {
    const userEmail = req.params.email;
    const { userName, email } = req.body;

    if (!userName || !email) {
      return res.status(400).json(formatResponse(null, "User name and email are required"));
    }

    const user = await db.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json(formatResponse(null, "User not found"));
    }

    const updatedUser = await db.updateUserProfile(user.id, req.body);
    return res.status(200).json(formatResponse(updatedUser, "User updated successfully"));
  } catch (error) {
    next(error);
  }
}
);

module.exports = router;
