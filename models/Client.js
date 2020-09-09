const mongoose = require('mongoose');
const ClientsSchema = mongoose.Schema({
  firstname:{
    type: String,
    required: true,
    trim: true
  },
  lastname:{
    type: String,
    required: true,
    trim: true
  },
  company:{
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone:{
    type: String,
    trim: true
  },
  createdat:{
    type: Date,
    default: Date.now()
  },
  consultant:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Client', ClientsSchema);