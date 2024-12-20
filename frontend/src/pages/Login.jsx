import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import axios from '../api/axios';

const LOGIN_URL = '/auth/login';

export default function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL,
        {
          user: user,
          pwd: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        console.log('goes in');
        navigate("/workout");
      }
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        console.log(err.response.data.message)
        setErrMsg('Registration Failed');
      }
    }
  }

  return (
    <>
      <section className='fixed w-full z-[1000]'>
        <Navbar />
      </section>

      <section className="relative w-full flex flex-col p-4 items-center justify-center h-screen bg-[url('.././images/background.jpg')] font-sans text-md bg-cover">
        <form className='flex flex-col justify-evenly w-full max-w-sm bg-black bg-opacity-65 rounded text-white p-5' onSubmit={handleSubmit}>

          {errMsg && <p className='bg-pink-300 font-semibold p-2 mb-2 text-red-700' aria-live="assertive">{errMsg}</p>}
          <h1 className='font-semibold text-2xl mb-5'>Sign In</h1>
          <label htmlFor='username' className='text-lg'>
            Username:
          </label>
          <input
            className='text-black rounded-md pl-1 py-1.5'
            type='text'
            id='username'
            autoComplete='off'
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />


          <label htmlFor="password" className='text-lg'>
            Password:
          </label>
          <input
            className='text-black mb-1 rounded-md pl-1 py-1.5'
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />

          <button
            disabled={!user || !pwd ? true : false}
            className={user && pwd
              ? 'bg-white text-black font-medium py-2 rounded-lg w-full mt-4 mb-2'
              : 'opacity-40 bg-white text-black font-medium py-2 rounded-lg w-full mt-4 mb-2'}>
            Sign In
          </button>

          <p className='text-md'>
            Need an account?<br />
            <span className="underline">
              <a href="/register">Sign Up</a>
            </span>
          </p>
        </form>
      </section>
    </>

  )
}