const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, 'spark123rvs');

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
