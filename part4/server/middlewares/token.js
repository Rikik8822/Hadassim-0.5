import jwt from "jsonwebtoken";

/**
 * Middleware to verify a user's token and check their role authorization.
 */
export const AuthMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "A token is required", title: "Token Verification Error" });
        }

        try {
            let decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (allowedRoles.length === 0) {
                return next();
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "You are not authorized to perform this action", title: "Unauthorized" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: err.message, title: "An error in verify token" });
        }
    };
};
