const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const orderModel = require('../models/orderModel');


// ROUTE: /api/order/%DYNAMIC%OrderStatus
router.get('/:status', async (req, res) => {
    try {
        const orders = await orderModel.find({ Status: req.params.status });
        res.json(orders.reverse());
    } catch (error) {
        console.log(error)
        res.status(500)
    }
});

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

// ROUTE: /api/order/updateSingleorder/%DYNAMIC%_id
router.put('/updateSingleOrder/:_id', async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(req.params._id, {
            BestillingsDato: req.body.Bestillingsdato,
            Virksomhed: req.body.Virksomhed,
            Kundenavn: req.body.Kundenavn,
            AntalIndtalinger: req.body.AntalIndtalinger,
            ValgteSpeaker: req.body.ValgteSpeaker,
            Status: req.body.Status
        });
        res.send("Updated order: " + req.params._id);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send("Updating order " + req.params._id + " failed...");
    }
})

module.exports = router;