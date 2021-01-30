const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer().single('file');

// ROUTE: /api/audio/%DYNAMIC%filename
router.get('/:filename', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json([]);
    }

    try {
        res.setHeader("content-type", "audio/*");
        if (fs.existsSync(`./uploads/${req.params.filename}`)) {
            fs.createReadStream(`./uploads/${req.params.filename}`).pipe(res);
        } else {
            throw "No such file or directory found.";
        }
        res.status(200);
    } catch (error) {
        res.status(404);
        res.json([]);
    }
});

// ROUTE: /api/audio/upload
router.post('/upload', function (req, res) {
    if (!req.user) {
        res.status(401);
        res.json({});
    }

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        }

        res.status(200);
        res.json({
            url: `/api/audio/${req.file.filename}`,
            name: req.file.originalname
        });
    });
});


module.exports = router;