const express = require("express");
const passport = require("passport");
const { createUser } = require("../controllers/userController");
const { getAllMessages } = require("../db/db");

function groupReplies(messages) {
    const map = new Map();
    messages.forEach(m => {
        if (m.parent_id) {
            if (!map.has(m.parent_id)) map.set(m.parent_id, []);
            map.get(m.parent_id).push(m);
        }
    });
    return map;
}

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
    const replyMap = groupReplies(messages);
    const user = req.user || null;
    res.render("main", { user, messages, replies: replyMap });
});

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
