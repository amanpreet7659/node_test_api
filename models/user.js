const mongose = require("mongoose");

const userSchema = mongose.Schema({
    _id: mongose.Schema.Types.ObjectId,
    email: String,
    firstName: String,
    lastName: String,
    middelName: String,
    phoneNumber: Number,
    dateOfBirth: Date,
    image_url: String,
    isDeleted: Boolean
})

module.exports = mongose.model("users", userSchema);