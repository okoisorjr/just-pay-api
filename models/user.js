const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  buisness_name: {
    type: String,
    default: null
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  agreed_terms: { 
    type: Boolean, 
    required: true,
    default: true
  },
  account_type: {
    type: String,
    required: true
  },

  refresh_token: {
    type: String,
    default: null
  }
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);
 
module.exports = User;