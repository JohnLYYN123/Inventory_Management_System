const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middlewares/middleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// Standard response format helper
const formatResponse = (data, message = "") => ({
  success: true,
  data,
  message
});

// GET /api/inventory
router.get("/", middleware.validateInventoryQueryParams,  jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
  try {
    const inventories = await db.getAllInventories(req.query);
    res.status(200).json(formatResponse(inventories));
  } catch (error) {
    next(error);
  }
});

// GET /api/inventory/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    const inventory = await db.getInventoryById(parseInt(req.params.id));
    if (!inventory) {
      return res.status(404).json(formatResponse(null, "Inventory not found"));
    }
    return res.status(200).json(formatResponse(inventory));
  } catch (error) {
    next(error);
  }
});

// POST /api/inventory
router.post("/", jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
  try {
    const errors = middleware.validateInventoryInput(req);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: "Validation failed"
      });
    }

    const newInventory = await db.createInventory(req.body);
    res.status(201).json(formatResponse(newInventory, "Inventory created"));
  } catch (error) {
    next(error);
  }
});

// PUT /api/inventory/:id
router.put("/:id", middleware.validateResourceId, middleware.validateInventoryUpdateInput, async (req, res, next) => {
  try {
    const inventoryId = parseInt(req.params.id);
    const existingInventory = await db.getInventoryById(inventoryId);

    if (!existingInventory) {
      return res.status(404).json(formatResponse(null, "Inventory not found"));
    }

    const updatedInventory = await db.updateInventory(inventoryId, req.body);
    return res.status(200).json(formatResponse(updatedInventory, "Inventory updated"));
  } catch (error) {
    next(error);
  }
});

// PUT /api/inventory/:id/retire
router.put("/:id/retire", middleware.validateResourceId, middleware.validateRetireInput, async (req, res, next) => {
  try {
    const inventoryId = parseInt(req.params.id);
    const { adminId, comment } = req.body;

    const existingInventory = await db.getInventoryById(inventoryId);

    if (!existingInventory) {
      return res.status(404).json(formatResponse(null, "Inventory not found"));
    }

    const retiredInventory = await db.retireInventory(inventoryId, parseInt(adminId), comment);
    return res.status(200).json(formatResponse(retiredInventory, "Inventory retired successfully"));
  } catch (error) {
    next(error);
  }
});

module.exports = router;