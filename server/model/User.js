const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-z0-9]+$/,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subjects: {
      type: Array,
      default: []
    }
  },
  { versionKey: false }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };