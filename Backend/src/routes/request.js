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

router.get("/", middleware.validateRequestQueryParams, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        console.log("req", req.query);
        if (req.query.requestorId) {
            req.query.requestorId = parseInt(req.query.requestorId);
        }
        if (req.query.deviceId) {
            req.query.deviceId = parseInt(req.query.deviceId);
        }
        if(req.query.Requeststatus){
            req.query.status = req.query.Requeststatus;
        }
        const requests = await db.getAllRequests(req.query);
        res.status(200).json(formatResponse(requests));
    } catch (error) {
        next(error);
    }
});

router.get("/:id", middleware.validateResourceId, async (req, res, next) => {
    try {
        const request = await db.getRequestById(parseInt(req.params.id));
        if (!request) {
            return res.status(404).json(formatResponse(null, "Request not found"));
        }
        return res.status(200).json(formatResponse(request));
    } catch (error) {
        next(error);
    }
});

router.post("/", jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        const errors = middleware.validateRequestInput(req.body);
        console.log("errors", errors);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
                message: "Validation failed"
            });
        }

        const newRequest = await db.createRequest(req.body);
        res.status(201).json(formatResponse(newRequest, "Request created"));
    } catch (error) {
        next(error);
    }
});

router.put("/:id", middleware.validateResourceId, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        console.log("body", req.body);
        const errors = middleware.validateRequestInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
                message: "Validation failed"
            });
        }

        const updatedRequest = await db.updateRequest(parseInt(req.params.id), req.body);
        if (!updatedRequest) {
            return res.status(404).json(formatResponse(null, "Request not found"));
        }
        res.status(200).json(formatResponse(updatedRequest, "Request updated"));
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", middleware.validateResourceId, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        console.log("delete requests", req.params);
        const deletedRequest = await db.deleteRequest(parseInt(req.params.id));
        console.log("deletedRequest", deletedRequest);
        if (!deletedRequest) {
            return res.status(404).json(formatResponse(null, "Request not found"));
        }
        res.status(200).json(formatResponse(deletedRequest, "Request deleted"));
    } catch (error) {
        next(error);
    }
});

router.post("/:id/approve", middleware.validateResourceId, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id);
        const request = await db.getRequestById(requestId);
        if (!request) {
            return res.status(404).json(formatResponse(null, "Request not found"));
        }

        const approvedRequest = await db.approveRequest(requestId, req.body);
        res.status(200).json(formatResponse(approvedRequest, "Request approved"));
    } catch (error) {
        next(error);
    }
});

router.post("/:id/reject", middleware.validateResourceId, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        const requestId = parseInt(req.params.id);
        const request = await db.getRequestById(requestId);
        if (!request) {
            return res.status(404).json(formatResponse(null, "Request not found"));
        }

        const rejectedRequest = await db.rejectRequest(requestId, req.body);
        res.status(200).json(formatResponse(rejectedRequest, "Request rejected"));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
