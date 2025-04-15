const express = require('express');
const router = express.Router();
const db = require('../database');
const s3 = require('../utils/doSpaces');
const sharp = require('sharp')
const upload = require('../middlewares/upload');

const formatResponse = (data, message = "") => ({
    success: true,
    data,
    message
});

// Handle file uploads
router.post('/upload/:deviceId/:transactionId/:activity', upload.single('file'), async (req, res) => {
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


})