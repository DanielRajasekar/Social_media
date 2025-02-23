const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    bio:String,
    filename: String,
  filepath: String,
  mimetype: String,
});


module.exports = mongoose.model('User ', userSchema); // Removed extra space in 'User '