const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');
const EmailService = require('../services/email.service');

function login(req, res, next) {
  User.findOne({ email: req.body.email })
    .select('_id password email name role profileImg')
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(500).json({ message: 'Email or password does not match' });
      }
      
      if (!user.is_verified) {
        return res.status(403).json({
          message: 'Please check your email inbox and verify your email!',
        });
      }
      
      return user.authenticate(req.body.password)
      .then(() => {
        const token = jwt.sign({
          _id: user._id, // eslint-disable-line
          name: user.name,
          email: user.email,
          role: user.role,
        }, config.jwtSecret, { expiresIn: config.jwtExpires });
        console.log(user)
        res.json({
          _id: user._id, // eslint-disable-line
          name: user.name,
          email: user.email,
          profileImg: user.profileImg,
          role: user.role,
          token,
        });
      })
      .catch(() => {
        res.status(500).json({ message: 'Email or password does not match' });
      });
    })
    .catch(next);
}

function signup(req, res, next) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
  .then((newUser) => {
    EmailService.sendEmail(newUser);
    res.json(newUser);
  })
  .catch(next);
}

module.exports = {
  login,
  signup,
};
