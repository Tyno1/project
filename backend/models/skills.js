const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const skillSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = model('Skills', skillSchema);