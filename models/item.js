
const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: String,
    description: String,
    filename: String,
    url: String,
    startingBid: Number,
    bidDeadline: Date,
    bids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid',
    }]
});

const Item = mongoose.model("Item", itemSchema)

module.exports = Item;