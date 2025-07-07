const express = require("express");
const passport = require("passport");
const { createUser } = require("../controllers/userController");

const router = express.Router();
router.get("/sign-up", (_req, res) => res.render("signup"));
router.post("/sign-up", createUser);

router.get("/login", (req, res) => {
    res.render("login", { error: req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
}));

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("main", { user: req.user });
    } else {
        res.redirect("/login");
    }
});

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
