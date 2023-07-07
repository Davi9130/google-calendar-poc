import './App.css';
import { useEffect, useState } from 'react';
import JSONPretty from 'react-json-pretty';

import axios from 'axios';

function App() {
  const [userInfos, setUserDetails] = useState({});
  const [calendarList, setCalendarList] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [screen, setScree] = useState('register');
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const [registerInfos, setRegisterInfos] = useState({
    name: '',
    email: '',
    password: '',
  });

  const makeTheRegister = async () => {
    if (
      !registerInfos.name ||
      !registerInfos.email ||
      !registerInfos.password
    ) {
      alert('Please fill all the fields');
      return;
    }

    try {
      await axios.post('http://localhost:3333/register', registerInfos);

      alert('User registered with success, please active the user in email');
    } catch (error) {
      console.log(error);
    }
  };

  const makeLogin = async () => {
    if (!login.email || !login.password) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const loginResp = await axios.post('http://localhost:3333/login', login);

      localStorage.setItem('@OnTimer-Token', loginResp.data.token);

      alert('User auth with success');

      setScree('home');
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem('@OnTimer-Token');

      const userResp = await axios.get('http://localhost:3333/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserDetails(userResp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCalendar = async () => {
    try {
      const token = localStorage.getItem('@OnTimer-Token');

      const calendarResp = await axios.get(
        'http://localhost:3333/getUserCalendar',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCalendarList(calendarResp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCalendarEvents = async () => {
    try {
      const token = localStorage.getItem('@OnTimer-Token');

      const calendarResp = await axios.get(
        'http://localhost:3333/getCalendarEvents',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCalendarEvents(calendarResp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createCalendar = async () => {
    try {
      const token = localStorage.getItem('@OnTimer-Token');

      await axios.post(
        'http://localhost:3333/createCalendar',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getUserCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  const createAnEvent = async () => {
    try {
      const token = localStorage.getItem('@OnTimer-Token');

      await axios.post(
        'http://localhost:3333/createEvent',
        {
          summary: 'New Event',
          description: 'teste123',
          start: '2023-08-06T10:00:00',
          end: '2023-08-06T11:00:00',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getCalendarEvents();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('@OnTimer-Token');

    if (token) {
      getUserDetails();

      if (screen === 'calendarList' && userInfos?.me?.calendar_uuid) {
        getUserCalendar();
      } else if (screen === 'events' && userInfos?.me?.calendar_uuid) {
        getCalendarEvents();
      } else if (screen === 'calendarList') {
      } else {
        setScree('home');
      }
    }
  }, [screen]);

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 500,
          gap: 8,
          backgroundColor: '#f1f1f1',
          alignSelf: 'center',
          marginLeft: '10%',
          padding: 160,
          borderRadius: 20,
        }}
      >
        {screen === 'register' && (
          <>
            <h2 style={{ marginBottom: 100 }}>REGISTER</h2>
            <input
              className="input"
              type="text"
              onChange={(e) => {
                setRegisterInfos({
                  ...registerInfos,
                  name: e.target.value,
                });
              }}
              placeholder="Enter your name"
            />

            <input
              className="input"
              type="text"
              onChange={(e) => {
                setRegisterInfos({
                  ...registerInfos,
                  email: e.target.value,
                });
              }}
              placeholder="Enter your email"
            />
            <input
              className="input"
              type="password"
              onChange={(e) => {
                setRegisterInfos({
                  ...registerInfos,
                  password: e.target.value,
                });
              }}
              placeholder="Enter your password"
            />
            <button className="button" onClick={makeTheRegister}>
              REGISTER
            </button>

            <p onClick={() => setScree('login')}>LOGIN</p>
          </>
        )}

        {screen === 'login' && (
          <>
            <h3>LOGIN</h3>
            <input
              className="input"
              type="text"
              onChange={(e) => {
                setLogin({
                  ...login,
                  email: e.target.value,
                });
              }}
              placeholder="Enter your email"
            />
            <input
              className="input"
              type="password"
              onChange={(e) => {
                setLogin({
                  ...login,
                  password: e.target.value,
                });
              }}
              placeholder="Enter your password"
            />
            <button className="button" onClick={makeLogin}>
              Login
            </button>
          </>
        )}

        {screen === 'home' && (
          <>
            <h3>HOME</h3>

            {userInfos?.me && (
              <>
                <div>
                  <p>Olá {userInfos.me.name} </p>

                  <p>Seu email é: {userInfos.me.email} </p>

                  <p>Seu id é: {userInfos.me.id} </p>

                  {userInfos.me.calendar_uuid ? (
                    <p>Seu calendar uuid é: {userInfos.me.calendar_uuid} </p>
                  ) : (
                    <p style={{ color: 'red' }}>
                      Você não tem um calendário, criei um abaixo
                    </p>
                  )}
                </div>

                <div>
                  {userInfos.me.calendar_uuid && (
                    <button
                      className="button"
                      onClick={() => setScree('calendarList')}
                    >
                      CALENDAR INFOS
                    </button>
                  )}
                  <button className="button" onClick={createCalendar}>
                    CREATE CALENDAR
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {screen === 'calendarList' && (
          <div>
            <h3>CALENDAR LIST</h3>

            <JSONPretty
              id="json-pretty"
              data={calendarList?.userCalendarFilter?.[0]}
            ></JSONPretty>

            <button onClick={() => setScree('events')}>CALENDAR EVENTS</button>
          </div>
        )}

        {screen === 'events' && (
          <>
            <div>
              <h3>CALENDAR EVENTS</h3>

              <JSONPretty id="json-pretty" data={calendarEvents}></JSONPretty>
            </div>

            <button onClick={createAnEvent}>CREATE EVENT</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
