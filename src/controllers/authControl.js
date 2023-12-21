const handleServerError = (res, error, message = 'Internal Server Error') => {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: message });
};

const excludePassword = (user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

const registerUser = async (req, res) => {
    try {
        const { error } = validateRegister(req.body);
        if (error) {
            const errorMessage = `Validation failed: ${error}`;
            return res.status(400).json({ error: errorMessage });
        }
        
        const exitingUser = await serviceUser.getUserByEmail(req.body.email);
        if (exitingUser) {
            return res.status(400).json({ error: 'Email is already registered'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(req.body.password, saltRounds);

        const newUser = await serviceUser.createUser({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        res.json({ message: 'Registration Successful', user: excludePassword(newUser) });
    } catch (error) {
        handleServerError(res, error, 'Error Registering User');
    }
};

const loginUser = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            const errorMessage = `Validation failed: ${error}`;
            return res.status(400).json({ error: errorMessage});
        }

        const { email, password } = req.body;

        const user = await serviceUser.getUserByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(200).json({
                message: 'Login Successful',
                user: excludePassword({ userId: user.user_id, email: user.email }),
                token: token,
            });
        } else {
            if (!user) {
                return res.status(404).json({ error: 'User Not Found' });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Invalid Password'});
            }
        }
    } catch (error) {
        handleServerError(res, error, 'Error Logging In');
    }
};

const generateToken = (user) => {
    const payload = {
        userId: user.user_id,
        email: user.email,
    };

    const option = {
        expiresIn: process.env.JWT_EXPIRES_IN,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.userid;
        const user = await serviceUser.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User Not Found' });
        }

        res.status(200).json({
            message: `User Found With ID ${userId}`,
            data: excludePassword(user),
        });
    } catch (error) {
        handleServerError(res, error, 'Error Getting User');
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, password } = req.body;

        const exitingUserWithEmail = await serviceUser.getUserByEmail(email);
        if (exitingUserWithEmail && exitingUserWithEmail.user_id !== userId) {
            return res.status(400).json({ error: 'Email Already Registered By Another User' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateUser = await serviceUser.updateUser(userId, {
            name: name,
            email: email,
            password: hashedPassword,
        });

        if (!updateUser) {
            console.error('User Not Found or Updated Failed');
            return res.status(404).json({ error: 'User Not Found or Updated Failed' });
        }

        res.status(200).json({
            message: 'User Updated Successfully',
            user: excludePassword(updateUser),
        });
    } catch (error) {
        handleServerError(res, error, 'Error Updating User');
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const deleteUser = await serviceUser.deleteUser(userId);

        if (!deleteUser) {
            return res.status(404).json({ error: 'User Not Found or Already Deleted' });
        }

        res.json({ message: 'User Deleted Successfully', user: excludePassword(deleteUser) });
    } catch (error) {
        handleServerError(res, error, 'Error Deleting User');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
};