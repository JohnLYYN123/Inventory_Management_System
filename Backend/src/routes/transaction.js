const express = require('express');
const router = express.Router();
const db = require('../database');
const s3 = require('../utils/doSpaces');
const sharp = require('sharp')
const { upload } = require('../middlewares/upload');
const { validateResourceId, validateTransactionFilters, validateReturnInput } = require('../middlewares/middleware');
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const formatResponse = (data, message = "") => ({
    success: true,
    data,
    message
});

// GET /api/transactions/:id
router.get("/:id", validateResourceId, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        const transactionId = parseInt(req.params.id);
        const transaction = await db.getTransactionById(transactionId);

        if (!transaction) {
            return res.status(404).json(formatResponse(null, "Inventory not found"));
        }

        return res.status(200).json(formatResponse(transaction));
    } catch (error) {
        next(error);
    }
});

// GET /api/transactions/:id
router.get("/", validateTransactionFilters, jwtMiddleware.jwtTokenAuthentication , async (req, res, next) => {
    try {
        const { activity, deviceId, executorId } = req.query;

        const filters = {
            activity: activity || undefined,
            deviceId: deviceId ? parseInt(deviceId) : undefined,
            executorId: executorId ? parseInt(executorId) : undefined,
        };

        const transactions = await db.getAllTransactions(filters);

        res.status(200).json(formatResponse(transactions));
    } catch (error) {
        next(error);
    }
});


// Handle file uploads
router.post('/upload/:deviceId/:transactionId/:activity', jwtMiddleware.jwtTokenAuthentication, upload.single('file'), async (req, res) => {
    try {
        const { deviceId, transactionId, activity } = req.params;
        const buffer = req.file.buffer;

        const metadata = await sharp(buffer).metadata();
        if (metadata.width < 800 || metadata.height < 600) {
            return res.status(400).json({ error: 'Image must be at least 800x600 resolution' });
        }

        const folder = activity === 'Borrow' ? 'borrow-photos' : 'return-photos';
        const fileName = `${deviceId}_${transactionId}_${activity}.jpg`;
        const key = `${folder}/${deviceId}/${fileName}`;

        await s3.putObject({
            Bucket: process.env.DO_SPACE_NAME,
            Key: key,
            Body: buffer,
            ACL: `public-read`,
            ContentType: 'image/jpeg'
        }).promise();

        const fileUrl = `https://${process.env.DO_SPACE_NAME}.${process.env.DO_SPACE_REGION}.digitaloceanspaces.com/${key}`;

        const updatedTransaction = await db.updateFileUrl(Number(transactionId), fileUrl);

        return res.status(200).json(formatResponse(updatedTransaction, "Upload successful"));
    } catch (error) {
        next(error);
    }
});

//PUT /api/inventory/:id/return
router.put("/:id/return", validateResourceId, validateReturnInput, jwtMiddleware.jwtTokenAuthentication, async (req, res, next) => {
    try {
        const deviceId = parseInt(req.params.id);
        const { userId, comment } = req.body;

        const transaction = await db.handleReturn(deviceId, parseInt(userId), comment);

        res.status(200).json(formatResponse(transaction, "Device returned successfully"));
    } catch (error) {
        next(error);
    }
});


module.exports = router;