const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  techStack: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = model('Projects', projectSchema);