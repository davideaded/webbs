require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const flash = require("connect-flash");

const app = express();
const authRoutes = require("./routes/auth");
require("./config/passport")(passport);

const serverAddress = process.env.ADDRESS || "127.0.0.1";
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "spfc", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.errorMessages = req.flash("error");
    res.locals.successMessages = req.flash("success");
    next();
});
// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send("Internal server error");
});

app.listen(port, serverAddress, () => {
    console.log(`Listening on http://${serverAddress}:${port}`);
});
