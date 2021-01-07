const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const audioModel = require('../models/audioModel');
const GridFsStorage = require("multer-gridfs-storage");
const multer = require('multer');
const path = require('path');

let gfs;

const upload = multer().single('file');


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
            res.status(500).json(err);
        } else if (err) {
            res.status(500).json(err);
        }

        const filename = req.file.filename;

        const newAudio = new audioModel({
            name: filename,
            fileID: req.file.id
        })

        newAudio.save()
            .then(data => {
                res.json(filename);
                res.status(200);
            })
            .catch(err => {
                console.log(err);
                res.json("Couldn't save audio.")
                res.status(500);
            })
    })

});


module.exports = router;