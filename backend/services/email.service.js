/*
  Sending email
*/
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const config = require('../config');
sgMail.setApiKey(process.env.SENDGRID_KEY);

function sendEmail(user) {
  const token = jwt.sign(
    {
      _id: user._id, // eslint-disable-line
    },
    config.jwtSecret,
    { expiresIn: config.jwtEmailExpires },
  );
  const url = `${process.env.CONFIRM_EMAIL_URL}/${token}`;
  const msg = {
    to: user.email,
    from: 'support@jogging.com',
    subject: 'Confirm your email!',
    text: 'Confirm your email',
    html: `Hello, <b>${user.name}!</b><br/>
        <p>Welcome to signup Jogging track Website</p>
        Please click this link to confirm your email address.<br/>
        <a href = "${url}">Click here!</a>
        <span>Thanks!</span>`,
  };
  sgMail.send(msg);
}

module.exports = {
  sendEmail,
};
