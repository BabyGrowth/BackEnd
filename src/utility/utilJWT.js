// (Memuat) berkas dari .env
dotenv.config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; 
        // (Verif) Token gagal ter-verifikasi
    }
};

export { generateToken, verifyToken };