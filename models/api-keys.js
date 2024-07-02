const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  description: {
    type: String,
    required: false
  },
  publicKey: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: false
  },
  user_id: {
    type: String,
    required: true
  }
}, {timestamps: true });

const NewKey = mongoose.model("Api-Key", ApiKeySchema);
 
module.exports = NewKey;