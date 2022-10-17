import jwt from "jsonwebtoken"
const config = process.env;

const verifyToken = (req) => {
    const token = req.cookies.user || null;
    if (!token) {
        return "A token is required for authentication"
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        return decoded.username
    } catch (err) {
        return "A token is required for authentication";
    }
};

export default verifyToken;