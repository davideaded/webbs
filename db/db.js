const pool = require("./pool");

async function getUser(usernameOrNull, idOrNull) {
    let query;

    if (idOrNull != null) {
        query = {
            text: `SELECT * FROM users WHERE id = $1;`,
            values: [idOrNull],
        };
    } else if (usernameOrNull != null) {
        query = {
            text: `SELECT * FROM users WHERE username = $1;`,
            values: [usernameOrNull],
        };
    } else {
        throw new Error("Either username or id must be provided");
    }

    const { rows } = await pool.query(query);
    return rows;
}

async function create(user) {
    const query = {
        text: `
        INSERT INTO users (name, lastname, username, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        values: [
            user.name,
            user.lastname,
            user.username,
            user.password,
            user.role,
        ],
    };

    const { rows } = await pool.query(query);
    return rows[0];
}

module.exports = {
    getUser,
    create,
};
