const express = require("express");
const { createMessage } = require("../controllers/messagesController");

const router = express.Router();
router.get("/new-message", (_req, res) => res.render("newmsg"));
router.post("/new-message", createMessage);

module.exports = router;
