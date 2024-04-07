const mongoose = require('mongoose');

const InvalidAccessTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
}, {timestamps: true });

const InvalidToken = mongoose.model("Invalid-Token", InvalidAccessTokenSchema);