const express = require("express");
const passport = require("passport");
const { createUser } = require("../controllers/userController");
const { getAllMessages } = require("../db/db");

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

router.get("/", async (req, res) => {
    const messages = await getAllMessages();
    const user = req.user || null;
    res.render("main", { user, messages });
});

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
