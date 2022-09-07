const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    bids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid',
    }]
});

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)
module.exports = User;