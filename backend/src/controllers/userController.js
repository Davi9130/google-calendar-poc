const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const {
  createGoogleCalendar,
  listCalendars,
  listCalendarEvents,
  createEventInCalendar,
} = require('../utils/googleCalendarUtils');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const login = async (req, resp) => {
  const { email } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  const jwtConfig = {
    expiresIn: '9999 years',
    algorithm: 'HS256',
  };

  const user = await userModel.findByEmail(email);

  if (!user[0].email_verified) {
    return resp.status(401).json({ message: 'User email not verified' });
  }

  const token = jwt.sign({ data: user[0].id }, JWT_SECRET, jwtConfig);

  delete user[0].password;

  return resp.status(200).json({ user: user[0], token });
};

const register = async (req, resp) => {
  const { name, email, password } = req.body;

  await userModel.register({ name, email, password });

  const generateEmailToken = (email) => {
    const JWT_SECRET = process.env.JWT_SECRET_VALIDATE;

    const jwtConfig = {
      expiresIn: '1 day',
      algorithm: 'HS256',
    };

    const token = jwt.sign({ data: email }, JWT_SECRET, jwtConfig);

    return token;
  };

  const jwtWithId = generateEmailToken(email);

  nodemailer
    .createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    .sendMail({
      from: 'notimer@mail.com',
      to: email,
      subject: 'Confirmação de email',
      html: `
      
      <h3>Bom dia ${name}, confirme seu email para prosseguir. </h3>
      <br>
      <a href="http://localhost:3333/confirmEmail/${jwtWithId}">ACTIVATE</a>
      `,
    });

  return resp.status(201).json({ message: 'User created successfully' });
};

const me = async (req, resp) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const AuthHeader = req.headers['authorization'];

  const token = AuthHeader.split(' ')[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  const data = await userModel.me(decoded.data);

  delete data[0].password;

  return resp.status(200).json({ me: data[0] });
};

const activeEmail = async (req, resp) => {
  const { email } = req.body;

  await userModel.verifyEmail(email);

  return resp.status(200).json({ message: 'Email verified' });
};

const createCalendar = async (req, resp) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const AuthHeader = req.headers['authorization'];

  const token = AuthHeader.split(' ')[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await userModel.me(decoded.data);

  if (user[0].calendar_uuid) {
    return resp.status(400).json({ message: 'User already have a calendar' });
  }

  const calendarUuid = uuid.v4();

  await createGoogleCalendar(calendarUuid);

  await userModel.setCalendarUuid(calendarUuid, user[0].id);

  return resp.status(200).json({ message: 'Calendar created' });
};

const getUserCalendar = async (req, resp) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const AuthHeader = req.headers['authorization'];

  const token = AuthHeader.split(' ')[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await userModel.me(decoded.data);

  const userCalendarUuid = user[0].calendar_uuid;

  const calendars = await listCalendars();

  const userCalendarFilter = calendars.filter(
    (calendar) => calendar.summary === userCalendarUuid
  );

  return resp.status(200).json({ userCalendarFilter });
};

const getCalendarEvents = async (req, resp) => {
  const userCalendarUuid = req.body.calendarUuid;

  const calendars = await listCalendars();

  const userCalendarFilter = calendars.filter(
    (calendar) => calendar.summary === userCalendarUuid
  );

  const calendarId = userCalendarFilter[0].id;

  const events = await listCalendarEvents(calendarId);

  return resp.status(200).json({ events });
};

const createCalendarEvent = async (req, resp) => {
  const { calendarUuid, summary, description, start, end } = req.body;

  const calendars = await listCalendars();

  const userCalendarFilter = calendars.filter(
    (calendar) => calendar.summary === calendarUuid
  );

  const calendarId = userCalendarFilter[0].id;

  const event = {
    summary,
    description,
    start,
    end,
  };

  const eventCreated = await createEventInCalendar(calendarId, event);

  return resp.status(200).json({ eventCreated });
};

module.exports = {
  createCalendarEvent,
  getCalendarEvents,
  getUserCalendar,
  createCalendar,
  activeEmail,
  login,
  register,
  me,
};
