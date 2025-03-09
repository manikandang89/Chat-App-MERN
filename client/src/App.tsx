import { useState } from 'react'
import './App.css';
import {Routes , Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
// import Layout from './components/Layout';
import { useAppSelector, useAppDispatch } from './redux/useHooks';


function App() {
const theme = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
      {/* <div className='my-12 text-center text-2xl font-semibold uppercase'> Hello React
      </div> */}
      <NavBar />
      {/* <Layout> */}

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/setting" element={<SettingPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>

      </Routes>

     
      {/* </Layout> */}
    </div>
  )
}

export default App
