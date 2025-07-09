const express = require("express");
const { createMessage, getMessageById, updateMessage } = require("../controllers/messagesController");

const router = express.Router();
router.get("/new", (_req, res) => res.render("newmsg"));
router.post("/new", createMessage);
router.get("/:id/edit", async (req, res, next) => {
    try {
        const [message] = await getMessageById(req.params.id);
        if (!message) {
            return res.status(404).send("Message not found");
        }
        res.render("editmsg", { message, errorMessages: [] });
    } catch (err) {
        next(err);
    }
});
router.post("/:id/edit/", updateMessage);

module.exports = router;
