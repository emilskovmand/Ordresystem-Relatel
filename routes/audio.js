const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const audioModel = require('../models/audioModel');
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const multer = require('multer');

let gfs;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/uploads")
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    },
});

const upload = multer({ storage: storage }).single('file');


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
router.post('/upload', function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            res.status(500).json(err);
        } else if (err) {
            console.log(err);
            res.status(500).json(err);
        }
        res.status(200).json(req.file);

    })

});


module.exports = router;