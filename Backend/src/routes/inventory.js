const express = require("express");
const router = express.Router();
const db = require("../database");
const middleware = require("../middleware");

// GET /api/inventory
router.get("/", middleware.validateInventoryQueryParams, async (req, res, next) => {
  try {
    const inventories = await db.getAllInventories(req.query);
    res.status(200).json({
      deviceName: inventories.deviceName,
      deviceStatus: inventories.status,
      deviceTypeId: inventories.deviceTypeId,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/inventory/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    const inventories = await db.getInventoryById(parseInt(req.params.id));
    if (!inventories) {
      return res.status(404).json({error: "Inventory not found"});
    } else {
      return res.status(200).json(inventories);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/inventory
router.post("/", async (req, res, next) => {
  try {
    const error = middleware.validateInventoryInput(req.body);
    console.log(error);
    if (error.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: error });
    }
    let newInventory = await db.createInventory(req.body);
    res.status(201).json(newInventory);
  } catch (error) {
    next(error);
  }
});

// PUT /api/inventory/:id
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    const errors = middleware.validateInventoryInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation Error", messages: errors });
    }
    req.params.id = parseInt(req.params.id);
    const inventories = await db.getInventoryById(req.params.id);
    if (!inventories) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    const newInventory = await db.updateInventory(req.params.id, req.body);
    return res.status(200).json(newInventory);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/inventory/:id
router.delete("/:id", middleware.validateResourceId, async (req, res, next) => {
  try {
    req.params.id = parseInt(req.params.id);
    const inventories = await db.getInventoryById(req.params.id);
    if (!inventories) {
      return res.status(404).json({ error: "Inventory not found" });
    } else {
      await db.deleteInventory(req.params.id);
      return res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;