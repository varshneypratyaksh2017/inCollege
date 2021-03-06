var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Book  = require("./models/book"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//new-entry

var session = require('express-session')
var MemoryStore = require('memorystore')(session)

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))

//upto here
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    bookRoutes = require("./routes/books"),
    indexRoutes      = require("./routes/index")
    

//mongoose.connect('mongodb://localhost:27017/inCollege', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://varshneynishu:pratyaksh@cluster0.ino51.mongodb.net/abc?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "India support Narendra  Modi and BJP",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);


app.listen(3000 || process.env.PORT, process.env.IP, function(){
   console.log("The inCollege Server Has Started !!");
});