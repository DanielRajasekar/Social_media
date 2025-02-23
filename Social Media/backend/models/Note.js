const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  caption: String,
  filename: String,
  filepath: String,
  mimetype: String,
});

module.exports = mongoose.model('Note', noteSchema);
