const prisma = new PrismaClient;

// (Mencari) user yang menggunakan userId
const getUserById = async (userId) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        return result;
    } catch (error) {
        handlerPrismaError(error);
    }
};


// (Mencari) user yang menggunakan Email
const getUserByEmail = async (email) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return result;
    } catch (error) {
        handlerPrismaError(error);
    }
};

// Membuat pengguna baru
const createUser = async ({ name, email, password}) => {
    try {
        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
            },
        });
        return result;
    } catch (error) {
        handlerPrismaError(error);
    }
};


// Memperbarui data pengguna
const updateUser = async (userId, { name, email, password}) => {
    try {
        const result = await prisma.user.update({
            where: {
                user_id: userId,
            },

            data: {
                name: name,
                email: email,
                password: password,
            },
        });
        return result;
    } catch (error) {
        handlerPrismaError(error);
    }
};

// Menghapus data pengguna
const deleteUser = async (userId) => {
    try {
        const result = await prisma.user.delete({
            where: {
                user_id: userId,
            },
        });
        return result;
    } catch (error) {
        handlerPrismaError(error);
    }
};


// Memutuskan koneksi pengguna ketika selesai
const disconnect = async () => {
    await prisma.$disconnect();
};

export default {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    disconnect
};

