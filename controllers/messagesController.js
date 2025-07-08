const db = require("../db/db");

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

module.exports = {
    createMessage
}
