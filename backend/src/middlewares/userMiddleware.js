const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const validateRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ message: 'missing fields' });
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(422).json({ message: 'invalid email' });
  }

  //check if email already exists
  const userExists = await userModel.findByEmail(email);

  if (userExists.length > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  if (password.length < 8) {
    return res
      .status(422)
      .json({ message: 'password must be at least 8 characters' });
  }

  //create password hash
  const salt = await bcrypt.genSaltSync(12);

  const passwordHash = await bcrypt.hashSync(password, salt);

  req.body.password = passwordHash;

  next();
};

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'missing fields' });
  }

  const user = await userModel.findByEmail(email);

  if (!user?.length) {
    return res.status(401).json({ message: 'User not registered' });
  }

  const userPasswordHash = user[0].password;
  const passwordIsValid = await bcrypt.compareSync(password, userPasswordHash);

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  next();
};

const validateToken = async (req, res, next) => {
  const AuthHeader = req.headers['authorization'];
  const JWT_SECRET = process.env.JWT_SECRET;

  const token = AuthHeader && AuthHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userModel.me(decoded.data);

    if (!user?.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

const validateGetCalendarEvents = async (req, res, next) => {
  await validateToken(req, res, () => {});

  const JWT_SECRET = process.env.JWT_SECRET;
  const AuthHeader = req.headers['authorization'];

  const token = AuthHeader.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);

    const user = await userModel.me(decoded.data);

    const userCalendarUuid = user[0].calendar_uuid;

    if (!userCalendarUuid) {
      return res.status(400).json({ message: 'User does not have a calendar' });
    }

    req.body.calendarUuid = userCalendarUuid;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

const validateCreateEvent = async (req, res, next) => {
  await validateGetCalendarEvents(req, res, () => {});

  const { summary, description, start, end } = req.body;

  if (!summary || !description || !start || !end) {
    return res.status(422).json({ message: 'missing fields' });
  }

  next();
};

const validateEmailActivation = async (req, res, next) => {
  const { token } = req.params;

  const JWT_SECRET = process.env.JWT_SECRET_VALIDATE;

  try {
    jwt.verify(token, JWT_SECRET);

    req.body.email = jwt.decode(token).data;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = {
  validateCreateEvent,
  validateGetCalendarEvents,
  validateEmailActivation,
  validateRegister,
  validateLogin,
  validateToken,
};
