var express = require("express");
var router  = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware");


//INDEX - show all books
router.get("/", function(req, res){
    var noMatch = null;
    // if(req.query.search) {
    //     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //     // Get all books from DB
    //     Book.find({name: regex}, function(err, allBooks){
    //        if(err){
    //            console.log(err);
    //        } else {
    //           if(allBooks.length < 1) {
    //               noMatch = "No books match that query, please try again.";
    //           }
    //           res.render("books/index",{books:allBooks, noMatch: noMatch});
    //        }
    //     });
	if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all books from DB
        Book.find({name: regex}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              if(allBooks.length < 1) {
                  noMatch = "No books match that query, please try again.";
              }
              res.render("books/index",{books:allBooks, noMatch: noMatch});
           }
        });
    } else {
        // Get all books from DB
        Book.find({}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              res.render("books/index",{books:allBooks, noMatch: noMatch});
           }
        });
    }
});

//CREATE - add new book to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to books array
    var name = req.body.name;
	var price = req.body.price;
	var bought = req.body.bought;
	var year = req.body.year;
	var contact = req.body.contact;
	var subject= req.body.subject;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBook = {name: name,price:price,bought: bought , year: year, subject:subject, image: image, description: desc, author:author, contact: contact }
    // Create a new book and save to DB
    Book.create(newBook, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to books page
            res.redirect("/books");
        }
    });
});

//NEW - show form to create new book
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("books/new"); 
});

// SHOW - shows more info about one book
router.get("/:id", function(req, res){
    //find the book with provided ID
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
        if(err || !foundBook){
            req.flash("error", "Book not found");
            res.redirect("back");
        } else {
    
            //render show template with that book
            res.render("books/show", {book: foundBook});
        }
    });
});

// EDIT BOOK ROUTE
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit", {book: foundBook});
    });
});

// UPDATE BOOK ROUTE
router.put("/:id",middleware.checkBookOwnership, function(req, res){
    // find and update the correct book
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
       if(err){
           res.redirect("/books");
       } else {
           //redirect somewhere(show page)
           res.redirect("/books/" + req.params.id);
       }
    });
});

// DESTROY BOOK ROUTE
router.delete("/:id",middleware.checkBookOwnership, function(req, res){
   Book.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/books");
      } else {
          res.redirect("/books");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

