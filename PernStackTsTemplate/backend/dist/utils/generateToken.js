import jwt from 'jsonwebtoken';
const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // in ms
        httpOnly: true,
        secure: true, // Ensure this is true if you're using HTTPS
        sameSite: 'None',
    });
    return token;
};
export default generateToken;
