const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const orderModel = require('../models/orderModel');


// ROUTE: /api/order/%DYNAMIC%OrderStatus
router.get('/statusOrders/:status', async (req, res) => {
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
    try {
        orderModel.updateMany(
            { _id: { $in: req.body.deleteList } },
            { $set: { Slettet: true } }, (err) => {
                if (err) { console.log(err); res.status(500); }
            });
        res.status(200);
        res.json("Successfully deleted these orders");
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// ROUTE: /api/order/permanentlyDelete
router.delete('/permanentlyDelete', async (req, res) => {
    try {
        orderModel.deleteMany({ _id: { $in: req.body.deleteList }, Slettet: true }, (err) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.json("Deleted orders: " + req.body.deleteList)
            }
        });
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

// ROUTE: /api/order/createOrder
router.post('/createOrder', (req, res) => {
    // Laver en ny ordre
    const order = new orderModel({
        _id: mongoose.Types.ObjectId(),
        OrdreId: req.body.OrdreId,
        BestillingsDato: req.body.Bestillingsdato,
        Virksomhed: req.body.Virksomhed,
        Kundenavn: req.body.Kundenavn,
        AntalIndtalinger: req.body.AntalIndtalinger,
        ValgteSpeaker: req.body.ValgteSpeaker,
        Status: req.body.Status
    })
    // Gemmer den nye ordre i databasen
    order.save()
        .then(data => {
            res.status(200);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })

    res.send("Retrieved Order!")
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
    }
})

// ROUTE: /api/order/updateSingleorder/%DYNAMIC%_id
router.put('/updateSingleOrder/:_id', async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(req.params._id, {
            BestillingsDato: req.body.Bestillingsdato,
            Virksomhed: req.body.Virksomhed,
            Kundenavn: req.body.Kundenavn,
            AntalIndtalinger: req.body.AntalIndtalinger,
            ValgteSpeaker: req.body.ValgteSpeaker,
            Status: req.body.Status,
            Slettet: req.body.Slettet
        });
        res.send("Updated order: " + req.params._id);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send("Updating order " + req.params._id + " failed...");
    }
})

module.exports = router;