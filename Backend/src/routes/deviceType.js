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

// GET /api/devicetype 
router.get("/", async (req, res, next) => {
    try {
        const deviceTypes = await db.getAllDeviceTypes(req.query);
        res.status(200).json(formatResponse(deviceTypes));
    } catch (error) {
        next(error);
    }
}
);

// GET /api/devicetype/:id
router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
    try {
        const deviceType = await db.getDeviceTypeById(parseInt(req.params.id));
        if (!deviceType) {
            return res.status(404).json(formatResponse(null, "Device type not found"));
        }
        return res.status(200).json(formatResponse(deviceType));
    } catch (error) {
        next(error);
    }
});

// POST /api/devicetype
router.post("/", async (req, res, next) => {
    try {
        const errors = middleware.validateDeviceTypeInput(req);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
                message: "Validation failed"
            });
        }

        const newDeviceType = await db.createDeviceType(req.body);
        res.status(201).json(formatResponse(newDeviceType, "Device type created"));
    } catch (error) {
        next(error);
    }
});

// PUT /api/devicetype/:id
router.put("/:id", middleware.validateResourceId, async (req, res, next) => {
    try {
        /*
        const errors = middleware.validateDeviceTypeInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
                message: "Validation failed"
            });
        }
        */

        const updatedDeviceType = await db.updateDeviceType(parseInt(req.params.id), req.body);
        if (!updatedDeviceType) {
            return res.status(404).json(formatResponse(null, "Device type not found"));
        }
        res.status(200).json(formatResponse(updatedDeviceType, "Device type updated"));
    } catch (error) {
        next(error);
    }
});

// DELETE /api/devicetype/:id
router.delete("/:id", middleware.validateResourceId, async (req, res, next) => {
    try {
        const deletedDeviceType = await db.deleteDeviceType(parseInt(req.params.id));
        if (!deletedDeviceType) {
            return res.status(404).json(formatResponse(null, "Device type not found"));
        }
        res.status(200).json(formatResponse(deletedDeviceType, "Device type deleted"));
    } catch (error) {
        next(error);
    }
});

module.exports = router;