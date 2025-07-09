const db = require("../db/db");

async function getMessageById(id) {
    try {
        return await db.getMessageById(id);
    } catch (err) {
        console.error(err);
    }
}

async function createMessage(req, res, next) {
    try {
        const { title, content } = req.body;
        const userId = req.user?.id;
        const createdAt = new Date();
        if (!title || !content || !createdAt || !userId) {
            req.flash("error", "All fields required");
            return res.redirect("/messages/new");
        }
        await db.createMessage({title, content, createdAt, userId});
        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

async function renderEditForm(req, res, next) {
    try {
        const { id } = req.params;
        const [msg] = await getMessageById(id);
        if (!msg) {
            return res.status(404).send("Message not found");
        }
        if (msg.user_id !== req.user?.id) {
            return res.status(403).send("Not authorized");
        }
        res.render("editmsg", { message: msg });
    } catch (err) {
        next(err);
    }
}

async function handleEditMessage(req, res, next) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const [msg] = await getMessageById(id);
        if (!msg) return res.status(404).send("Message not found");
        if (msg.user_id !== req.user?.id) return res.status(403).send("Not authorized");
        await db.updateMessage(id, title, content);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

async function handleDeleteMessage(req, res, next) {
    try {
        const { id } = req.params;
        const [msg] = await getMessageById(id);
        if (!msg) return res.status(404).send("Message not found");
        if (msg.user_id !== req.user?.id) return res.status(403).send("Not authorized");
        await db.deleteMessage(id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createMessage,
    getMessageById,
    handleEditMessage,
    handleDeleteMessage,
    renderEditForm
}
