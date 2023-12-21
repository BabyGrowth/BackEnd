// (Memuat) berkas dari .env
dotenv.config();

const authMW = (req, res, next) => {
    // (Mendapatkan) Token dari permintaan header
    const token = req.headers.authorization;

    if (!token || !token.startedWith('Bearer ')) {
        return res.status(401).json({ error: { message: 'Unauthorized: Missing or Invalid Token Format' } });
    }

    const tokenWithoutBearer = token.split('Bearer ')[1];

    if (!tokenWithoutBearer) {
        return res.status(401).json({ error: { message: 'Unauthorized: Missing Token Value' } });
    }

    try {
        // (Memverifikasi dan Mendekode) Token tersebut
        const decodedToken = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // (Melampirkan) Informasi Pengguna ke Objek Pengguna
        req.user = decodedToken;

        // (Melanjutkan) Middleware atau penanganan berikutnya
        next();
    } catch (error) {
        return res.status(401).json({ error: { message: 'Unauthorized Token Verification Failed', details: error.message } });
    }
};

export default authMW;