const mongoose = require('mongoose');


const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  course: {
    type: String,
    required: true
  }
})

let mentorModel = mongoose.model('mentor', mentorSchema)
module.exports = { mentorModel }