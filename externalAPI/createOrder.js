const orderModel = require('../models/orderModel');
const recordingModel = require('../models/recordingModel');
const mongoose = require('mongoose');

async function GetOrderId() {
    try {
        orderModel.find({ OrdreId: { $gte: 0 } }).limit(1).exec((err, docs) => {
            if (err) {
                console.error(err);
            }
            if (docs.length > 0) {
                orderModel.find({ OrdreId: { $gte: 0 } }).sort({ OrdreId: -1 }).limit(1).exec((err, docs) => {
                    if (err) {
                        console.error(err);
                    }
                    return docs[0].OrdreId + 1
                });
            }
            else {
                return 1;
            }
        })
    } catch (err) {
        console.log("Serverfejl: newid");
        console.error(err);
    }
}

async function CreateRecordings(res, recordingArray) {
    const recording = new recordingModel({
        recordings: recordingArray,
        audio: []
    });

    await recording.save().catch(err => {
        console.log("Serverfejl: CreateRecordings");
        console.error(err);
    });

    return recording.id;
}

const dato = () => {
    const dateForDateTimeInputValue = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 16);
    return dateForDateTimeInputValue(new Date());
}

async function createOrder(orderStructure, res) {

    const testorder = new orderModel({
        _id: mongoose.Types.ObjectId(),
        OrdreId: 10,
        BestillingsDato: dato(),
        Virksomhed: orderStructure.virksomhed,
        Kundenavn: orderStructure.name,
        AntalIndtalinger: orderStructure.indtalinger.length,
        ValgteSpeaker: orderStructure.stemme,
        Status: "Ny Ordre",
        Mail: orderStructure.mail,
        Language: orderStructure.sprog
    });

    console.log(testorder);

    testorder.save();

    console.log("Step 1");

    const orderId = await GetOrderId();
    console.log("Id: " + orderId)
    const recordingId = await CreateRecordings(res, orderStructure.indtalinger);
    console.log(recordingId);
    console.log("Step 2");

    const order = new orderModel({
        _id: mongoose.Types.ObjectId(),
        OrdreId: orderId,
        BestillingsDato: dato(),
        Virksomhed: orderStructure.virksomhed,
        Kundenavn: orderStructure.name,
        AntalIndtalinger: orderStructure.indtalinger.length,
        ValgteSpeaker: orderStructure.stemme,
        Status: "Ny Ordre",
        Recording: recordingId,
        Mail: orderStructure.mail,
        Language: orderStructure.sprog
    });

    console.log("Step 3");

    order.save()
        .then(data => {
            return `Ordre nr.: '${orderId}' skabt!`
        })
        .catch(err => {
            console.log(`Serverfejl: CreateOrder failed while saving...`)
            console.error(err);
            return "Kunne ikke skabe ordre..."
        })
}


module.exports = createOrder;