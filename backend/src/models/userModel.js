const connection = require('./connection');

const register = async (data) => {
  const { name, email, password } = data;

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  const [user] = await connection.execute(query, [name, email, password]);

  return user;
};

const login = async () => {
  const [users] = await connection.execute('SELECT * FROM users');

  return users;
};

const sendRegisterVerificationEmail = () => {};

const sendTwoFactorCode = () => {};

const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email=?';

  const [user] = await connection.execute(query, [email]);

  return user;
};

const me = async (userId) => {
  const query = 'SELECT * FROM users WHERE id=?';

  const [user] = await connection.execute(query, [userId]);

  return user;
};

const verifyEmail = async (email) => {
  const query = 'UPDATE users SET email_verified=? WHERE email=?';

  const user = await connection.execute(query, [true, email]);

  return user;
};

const setCalendarUuid = async (uuid, userId) => {
  const query = 'UPDATE users SET calendar_uuid=? WHERE id=?';

  const user = await connection.execute(query, [uuid, userId]);

  return user;
};

module.exports = {
  verifyEmail,
  setCalendarUuid,
  register,
  login,
  sendRegisterVerificationEmail,
  sendTwoFactorCode,
  findByEmail,
  me,
};
