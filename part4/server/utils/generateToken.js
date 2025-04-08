import jwt from "jsonwebtoken";
/**
 * Generates a JWT token containing the user's ID and role.
 */
export const generateToken = (user) => {
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
    return token;
}