const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.findUserByName = (name) => {
    User.findOne({ name: name })
        .then(user => {
            bcrypt.compare("_GuestD7L0", user.password)
                .then(valid => {
                    if (!valid)
                        return false;
                    else
                        return true;
                })
                .catch(error => { return false });
        })
        .catch(error => {
            return false;
        });
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => {
                if (this.findUserByName(req.body.name)) {
                    User.updateOne({name: req.body.name}, { email: req.query.email, password: hash })
                        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                        .catch(error => res.status(500).json({ error }));
                } else {
                    res.status(400).json({ error });
                }
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                if (req.body.password == "_GuestD7L0") {
                    this.signup(req, res, next);
                } else
                    return res.status(400).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                userId: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '24h' }
                )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getUser = (req, res, next) => {
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    User.find(keyword).find({ _id: { $ne: req.auth.userId } })
        .then(users => {
            if (!users) {
                return res.status(400).json({ error: 'Utilisateur non trouvé !' });
            }
            res.send(users);
        })
        .catch(error => res.status(500).json({error}));
}

exports.updateUser = (req, res, next) => {
    User.updateOne({_id: req.auth.userId}, { name: req.query.name })
    .then(
        () => {
            res.status(201).json({
                message: 'Nickname updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}