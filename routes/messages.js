const express = require("express");
const { createMessage, renderEditForm, handleEditMessage, handleDeleteMessage } = require("../controllers/messagesController");

const router = express.Router();
router.get("/new", (_req, res) => res.render("newmsg"));
router.post("/new", createMessage);
router.get("/:id/edit", renderEditForm);
router.post("/:id/edit", handleEditMessage);
router.delete("/:id/", handleDeleteMessage);

module.exports = router;
