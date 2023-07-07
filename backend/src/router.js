const express = require('express');
const userController = require('./controllers/userController');
const userMiddleware = require('./middlewares/userMiddleware');

const router = express.Router();

router.post(
  '/register',
  userMiddleware.validateRegister,
  userController.register
);

router.post('/login', userMiddleware.validateLogin, userController.login);

router.get('/me', userMiddleware.validateToken, userController.me);

router.get(
  '/confirmEmail/:token',
  userMiddleware.validateEmailActivation,
  userController.activeEmail
);

router.post(
  '/createCalendar',
  userMiddleware.validateToken,
  userController.createCalendar
);

router.get(
  '/getUserCalendar',
  userMiddleware.validateToken,
  userController.getUserCalendar
);

router.get(
  '/getCalendarEvents',
  userMiddleware.validateGetCalendarEvents,
  userController.getCalendarEvents
);

router.post(
  '/createEvent',
  userMiddleware.validateCreateEvent,
  userController.createCalendarEvent
);

module.exports = router;
