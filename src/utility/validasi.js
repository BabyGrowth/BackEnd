// (Skema) Validasi untuk pendaftaran pengguna

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
});

// (Skema) Validasi untuk login pengguna

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
});

// (Fungsi) Validasi input pada Pendaftaran Pengguna

const validateRegister = (data) => {
    const { error } = registerSchema.validate(data);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(',');
        return { error: errorMessage};
    }
    return { value: data};
    // (Kembali) Data yang sudah divalidasi jika tidak ada error
};

// (Fungsi) Validasi pada input Login Pengguna

const validateLogin = (data) => {
    const { error } = loginSchema.validate(data);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(',');
        return { error: errorMessage};
    }
    return { value: data};
    // (Kembali) Data yang sudah divalidasi jika tidak ada error
};

export { validateRegister, validateLogin };