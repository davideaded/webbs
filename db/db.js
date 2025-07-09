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

async function createUser(user) {
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

async function getMessageById(id) {
    if (!id) throw new Error("Id must be provided");
    const query = {
        text: `SELECT * FROM publications WHERE id = $1;`,
        values: [id],
    };
    const { rows } = await pool.query(query);
    return rows;
}

async function getAllMessages() {
    const query = {
        text: `
        SELECT 
        publications.*,
        users.username AS user
        FROM publications
        JOIN users ON publications.user_id = users.id;
        `,
        values: [],
    };
    const { rows } = await pool.query(query);
    return rows;
}

async function createMessage(message) {
    const query = {
        text: `
        INSERT INTO publications (title, content, created_at, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        values: [
            message.title,
            message.content,
            message.createdAt,
            message.userId,
        ],
    };

    const { rows } = await pool.query(query);
    return rows[0];
}

async function updateMessage(id, title, content) {
    if (!id) throw new Error("Id must be provided");
    if (!title || !content) throw new Error("Title and content are required");

    const query = {
        text: `UPDATE publications
        SET title = $1, content = $2
        WHERE id = $3
        RETURNING *;`,
        values: [title, content, id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
}

async function deleteMessage(id) {
    if (!id) throw new Error("Id must be provided");

    const query = {
        text: `DELETE FROM publications WHERE id = $1 RETURNING *;`,
        values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
}

module.exports = {
    getUser,
    createUser,
    getAllMessages,
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage
};
