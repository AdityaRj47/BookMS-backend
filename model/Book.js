const mongoose = require("mongoose");

//Creating Schema
const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    year: {type: Number, required: true},

});
module.exports = mongoose.model("Book", bookSchema);
//Book is the collection of books