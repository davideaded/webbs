const pool = require("./pool");

async function getUser(username) {
    const query = {
        text: `SELECT
        *
        FROM users
        WHERE username = $1;`,
        values: [username]
    };
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
