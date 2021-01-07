const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const audioModel = require('../models/audioModel');
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const multer = require('multer');

let gfs;

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer();


mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
})

// ROUTE: /api/audio/%DYNAMIC%filename
router.get('/:filename', (req, res) => {
    res.status(200);
    res.send("Worked");
    console.log(req.body);
});

// ROUTE: /api/audio/paths/%DYNAMIC%OrderId
router.get('/paths/:_id', (req, res) => {

})

// ROUTE: /api/audio/upload
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        console.log(req.file);
        res.status(200);
        res.send("Uploaded file");
    } catch (error) {
        res.status(500);
        console.log(error);
        res.send("Couldn't upload file");
    }
});


module.exports = router;