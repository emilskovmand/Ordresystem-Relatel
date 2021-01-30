const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const orderModel = require('../models/orderModel');

const commentModel = require('../models/commentModel');

const recodingModel = require('../models/recordingModel');
const recordingModel = require('../models/recordingModel');

// ROUTE: /api/order/statusOrders/%DYNAMIC%OrderStatus
router.get('/statusOrders/:status', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json([]);
        return;
    }

    try {
        const orders = await orderModel.find({ Status: req.params.status, Slettet: false });
        res.json(orders.reverse());
        res.status(200);
    } catch (error) {
        console.log(error)
        res.status(500)
    }
});


// ROUTE: /api/order/deleted
router.get('/deleted', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json([]);
        return;
    }

    try {
        const orders = await orderModel.find({ Slettet: true });
        res.json(orders.reverse());
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

// ROUTE: /api/order/delete
router.delete('/delete', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Intet login informationer");
        return;
    }

    try {
        orderModel.updateMany(
            { _id: { $in: req.body.deleteList } },
            { $set: { Slettet: true } }, (err) => {
                if (err) { console.log(err); res.status(500); }
            });
        res.status(200);
        res.json("Ordrer blev slettet med succes!");
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// ROUTE: /api/order/permanentlyDelete
router.delete('/permanentlyDelete', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Intet login informationer");
        return;
    }

    try {
        orderModel.deleteMany({ _id: { $in: req.body.deleteList }, Slettet: true }, (err) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.json("Slettede ordrer: " + req.body.deleteList)
            }
        });
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

// ROUTE: /api/order/createOrder
router.post('/createOrder', async (req, res) => {
    if (!req.user.permissions.createOrder && !req.user.permissions.admin) {
        res.status(401);
        res.json("Manglende tilladelser til at skabe ordre");
        return;
    }

    const recordingId = await UpdateOrderRecordings(null, req.body.indtalinger, []);

    // Laver en ny ordre
    const order = new orderModel({
        _id: mongoose.Types.ObjectId(),
        OrdreId: req.body.OrdreId,
        BestillingsDato: req.body.Bestillingsdato,
        Virksomhed: req.body.Virksomhed,
        Kundenavn: req.body.Kundenavn,
        AntalIndtalinger: req.body.AntalIndtalinger,
        ValgteSpeaker: req.body.ValgteSpeaker,
        Status: req.body.Status,
        Recording: recordingId
    })
    // Gemmer den nye ordre i databasen
    order.save()
        .then(data => {
            res.json(`Ordre nr.: '${req.body.OrdreId}' skabt!`)
            res.status(200);
        })
        .catch(err => {
            console.log(err);
            res.json("Kunne ikke skabe ordre...")
            res.status(500);
        })
});

// ROUTE: /api/order/newid
router.get('/newid', async (req, res) => {
    try {
        orderModel.find({ OrdreId: { $gte: 0 } }).limit(1).exec((err, docs) => {
            if (err) {
                res.status(500);
                console.log(err);
            }
            if (docs.length > 0) {
                orderModel.find({ OrdreId: { $gte: 0 } }).sort({ OrdreId: -1 }).limit(1).exec((err, docs) => {
                    if (err) {
                        res.status(500);
                        console.log(err);
                    }
                    res.json(docs[0].OrdreId + 1);
                    res.status(200);
                });
            }
            else {
                res.json(1);
                res.status(200);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500);
        res.json("Serverfejl: newid");
    }
})

// ROUTE: /api/order/updateSingleorder/%DYNAMIC%_id
router.put('/updateSingleOrder/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Ingen brugerinformationer");
    }

    try {
        const recordingId = await UpdateOrderRecordings(req.body.recordingArrays.Id, req.body.recordingArrays.array, req.body.recordingArrays.audio);

        const updatedOrder = await orderModel.findByIdAndUpdate(req.params._id, {
            BestillingsDato: req.body.Bestillingsdato,
            Virksomhed: req.body.Virksomhed,
            Kundenavn: req.body.Kundenavn,
            AntalIndtalinger: req.body.AntalIndtalinger,
            ValgteSpeaker: req.body.ValgteSpeaker,
            Status: req.body.Status,
            Slettet: req.body.Slettet,
            Recording: recordingId
        });
        res.json("Opdaterede ordre nr.: " + updatedOrder.OrdreId);
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json("Kunne ikke gemme ændringer til ordre " + req.params._id);
    }
});

// ROUTE: /api/order/massaction
router.put('/massapprove', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Ingen brugerinformationer");
    }

    try {
        await orderModel.updateMany(
            { _id: { $in: req.body.orderIds } },
            { $set: { Status: "Under Produktion" } }, (err) => {
                if (err) { console.log(err); res.status(500).json("Massehandling databasefejl.");; }
            });
        res.status(200).json("Massehandling udført på " + req.body.orderIds.length + " Antal ordre.");
    } catch (error) {
        console.log(error);
        res.status(500).json("Massehandling virkede ikke.");
    }
});

// ROUTE: /api/order/comments/%DYNAMIC%_id
router.get('/comments/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Ingen brugerinformationer");
    }

    try {
        const order = await orderModel.findById(req.params._id);
        if (order.Comments) {
            const comments = await commentModel.findById(order.Comments);
            res.json(comments.array);
            res.status(200);
        } else {
            res.json([]);
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json([]);
    }
})

// ROUTE: /api/order/addcomment/%DYNAMIC%_id
router.post('/addcomment/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json("Ingen brugerinformationer");
    }

    try {
        const order = await orderModel.findById(req.params._id);
        // Make new comment model
        if (!order.Comments) {
            const comment = new commentModel({
                array: [{
                    message: req.body.text,
                    username: req.user.username
                }]
            })

            comment.save().catch(err => {
                console.log(err);
                res.json("Kunne ikke skabe kommentar.")
                res.status(500);
            });

            order.Comments = comment._id;
            order.save().catch(err => {
                console.log(err);
                res.json("Kunne ikke skabe kommentar.")
                res.status(500);
            });;
        }
        // Add to existing model
        else {
            const comment = await commentModel.findById(order.Comments);
            comment.array.push({
                message: req.body.text,
                username: req.user.username
            })

            comment.save().catch(err => {
                console.log(err);
                res.json("Kunne ikke skabe kommentar.")
                res.status(500);
            });;
        }

        res.json("Skrev kommentar til: " + order.OrdreId);
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json("Serverfejl: addcomment")
    }
});

async function UpdateOrderRecordings(recordingId, recordingArray, recordingAudio) {
    try {
        // Update existing
        if (recordingId) {
            const recording = await recordingModel.findByIdAndUpdate(recordingId, {
                recordings: recordingArray,
                audio: recordingAudio
            });

            if (!recording) {
                const recording = new recordingModel({
                    recordings: recordingArray,
                    audio: recordingAudio
                });

                await recording.save().catch(err => {
                    console.log(err);
                });

                return recording.id;
            } else {
                return recordingId;
            }
        }
        // Create new
        else {
            const recording = new recordingModel({
                recordings: recordingArray,
                audio: recordingAudio
            });

            await recording.save().catch(err => {
                console.log(err);
            });

            return recording.id;
        }
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

// ROUTE: /api/order/recordings/%DYNAMIC%_id
router.get('/recordings/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401);
        res.json([]);
    }

    if (req.params._id.length < 10) {
        res.status(200).json([]);
        return;
    }

    try {
        const recording = await recordingModel.findById(req.params._id);
        if (recording) {
            res.status(200).json(recording);
        } else {
            res.status(404).json([]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Serverfejl da applikationen forsøgte at indsamle indtalinger.");
    }
});

module.exports = router;