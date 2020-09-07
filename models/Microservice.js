const mongoose = require('mongoose');
const MicroservicesSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  description:{
    type: String,
    required: true,
    trim: true
  },
  URL:{
    type: String,
    required: true,
    trim: true
  },
  createdat:{
    type: Date,
    default: Date.now()
  }

});

  module.exports = mongoose.model('Microservice', MicroservicesSchema);