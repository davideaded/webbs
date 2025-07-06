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
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).send("This username is already registered");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(firstname);
        const newUser = await db.create({
            name: firstname,
            lastname,
            username,
            password: hashedPassword,
            role,
        });
        console.log(newUser);
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUser,
};
