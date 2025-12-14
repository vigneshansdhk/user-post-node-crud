
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


