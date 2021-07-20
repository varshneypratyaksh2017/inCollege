var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
   name: String,
   price: String,
   contact: String,
   year: String,
   bought: String,
   subject: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Book", bookSchema);