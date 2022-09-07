const mongoose = require("mongoose");
const { Schema } = mongoose;

const bidSchema = new Schema({
    amount: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
    }
});

const Bid = mongoose.model("Bid", bidSchema)
module.exports = Bid;