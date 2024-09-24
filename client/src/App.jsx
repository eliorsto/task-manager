import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setFullName, setTasks, setSubjects, setChats } from './store/store';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import Navbar from './components/navbar/NavBar';
import Home from './pages/home/Home';
import Footer from './components/footer/Footer';
import axios from 'axios';
import Auth from './components/Auth/Auth';
import { url } from './backend';
import ResetPassword from './pages/resetPassword/ResetPassword';

function App() {
  const dispatch = useDispatch();
  const { showAuth, token, theme } = useSelector((state) => state.user);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      const refreshToken = localStorage.getItem('taskPilot_token');

      try {
        if (refreshToken && !token) {
          const res = await axios.post(`${url}/auth/replace`, {}, {
            headers: {
              refreshToken
            }
          });

          if (res.statusCode === res.ok) {
            dispatch(setToken(res.data.token));
            dispatch(setFullName(res.data.fullName));
            dispatch(setTasks(res.data.tasks));
            dispatch(setSubjects(res.data.subjects));
            dispatch(setChats(res.data.chats));
          }

        }
      } catch (err) {
        console.error(err.message);
      }
      setLoad(true);
    }

    validateUser();
  }, []);

  return load && <>
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar />
      {showAuth && !token && < Auth />}
      <Routes>
        <Route path="/" element={
          <>
            <WelcomePage />
            <Footer />
          </>
        } />
        <Route path="/home/*" element={<Home />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  </>
}
export default App;
