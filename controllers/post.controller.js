
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [name, email, hashedPassword];

        const result = await pool.query(query, values);

        res.status(200).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password is Incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'spark123rvs',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

exports.userCreate = async (req, res) => {
    try {
        const { title, content } = req.body;

        const userId = req.user.id;

        const values = [userId, title, content];

        const query = `
      INSERT INTO posts (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

        const result = await pool.query(query, values);

        return res.status(200).json({
            message: "User Posted Successfully",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.userGetAllPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.query;

        let query = `
            SELECT * FROM posts
            WHERE user_id = $1
        `;
        let values = [userId];
        let index = 2;

        if (title) {
            query += ` AND title ILIKE $${index++}`;
            values.push(`%${title}%`);
        }

        if (content) {
            query += ` AND content ILIKE $${index++}`;
            values.push(`%${content}%`);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            message: "User Post Listed Successfully",
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.userEdit = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const query = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(query, [postId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found or not authorized" });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.userUpdate = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
        const checkResult = await pool.query(checkQuery, [postId, userId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Post not found or not authorized" });
        }

        const updateQuery = `
            UPDATE posts
            SET title = $1, content = $2, updated_at = NOW()
            WHERE id = $3 AND user_id = $4
            RETURNING *
        `;
        const result = await pool.query(updateQuery, [title, content, postId, userId]);

        return res.status(200).json({
            message: "Post updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.userDelete = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
        const checkResult = await pool.query(checkQuery, [postId, userId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Post not found or not authorized" });
        }

        const deleteQuery = `DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *`;
        const result = await pool.query(deleteQuery, [postId, userId]);

        return res.status(200).json({
            message: "Post deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};







