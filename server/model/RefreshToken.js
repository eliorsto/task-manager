const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24 * 7
        },
    },
    { versionKey: false }
);

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = { RefreshToken }