const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(request, response) {
    const candidate = await User.findOne({ email: request.body.email });

    if (candidate) {
        const passwordResult = bcrypt.compareSync(request.body.password, candidate.password);

        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, { expiresIn: 3600 });
            response.status(200).json({ token: `Bearer ${token}` });
        } else {
            response.status(401).json({ message: 'Неверный пароль!' });
        }
    } else {
        response.status(404).json({ message: 'Пользователь с таким адресом не найден!' });
    }
}

module.exports.register = async function(request, response) {
    const candidate = await User.findOne({ email: request.body.email });

    if (!candidate) {
        const user = new User({
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10))
        });

        try {
            await user.save();
            response.status(200).json(user);
        } catch (error) {
            errorHandler(response, error);
        }
    } else {
        response.status(409).json({ message: 'Пользователь с таким адресом уже существует!' })
    }
}
