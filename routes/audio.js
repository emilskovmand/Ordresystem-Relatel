const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
var streamBuffers = require('stream-buffers');
const fs = require('fs');

const upload = multer().single('file');

// ROUTE: /api/audio/%DYNAMIC%filename
router.get('/:filename', async (req, res) => {
    res.setHeader("content-type", "audio/*");
    fs.createReadStream(`./uploads/${req.params.filename}`).pipe(res);
    res.status(200);
});

// ROUTE: /api/audio/upload
router.post('/upload', function (req, res) {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        }

        res.status(200);
        res.json(`/api/audio/${req.file.filename}`);
    });
});


module.exports = router;