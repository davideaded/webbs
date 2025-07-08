const db = require("../db/db");
const bcrypt = require("bcryptjs");

async function createUser(req, res, next) {
    try {
        const { firstname, lastname, username, password } = req.body;
        const role = "user";

        if (!username || !password || !firstname || !lastname) {
            return res.status(400).send("All fields required");
        }
        const [existingUser] = await db.getUser(username);
        if (existingUser) {
            return res.status(400).send("This username is already registered");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        await db.createUser({
            name: firstname,
            lastname,
            username,
            password: hashedPassword,
            role,
        });
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
}

async function authUser(username, password, done) {
    try {
        const [user] = await db.getUser(username, null);
        if (user === undefined) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}

async function deserialize(id, done) {
    try {
        const [user] = await db.getUser(null, id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch(err) {
        done(err);
    }
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must log-in to create a message");
    res.redirect("/");
}

module.exports = {
    createUser,
    authUser,
    deserialize,
    isAuthenticated,
};
