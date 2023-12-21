const express = require('express')
const {
        registerUser,
        loginUser,
        getUser,
        updateUser,
        deleteUser
} = require("../controllers/authControl");

const router = express.Router();

// (RUTE) untuk Pendaftaran Pengguna Baru
router.post('/register', authControl.registerUser);

// (RUTE) untuk Login
router.post('/login', authControl.loginUser);

// (RUTE) untuk Mendapatkan Informasi dari Pengguna
router.get('/', authMW, authControl.getUser);

// (RUTE) untuk Memperbarui Informasi dari Pengguna
router.put('/', authMW, authControl.updateUser);

// (RUTE) untuk Menghapus Pengguna
router.delete('/', authMW, authControl.deleteUser);

module.exports = router;