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
        console.log(title, content, userId, createdAt);
        if (!title || !content || !createdAt || !userId) {
            req.flash("error", "All fields required");
            return res.redirect("/messages/new-message");
        }
        await db.createMessage({title, content, createdAt, userId});
        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

async function updateMessage(req, res, next) {
    try {
        const { title, content } = req.body;
        const { id } = req.params;
        console.log(title, content, id);
        if (!title || !content) {
            req.flash("error", "All fields required");
            return res.redirect(`/messages/${id}/edit`);
        }
        await db.updateMessage(id, title, content);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createMessage,
    getMessageById,
    updateMessage,
}
