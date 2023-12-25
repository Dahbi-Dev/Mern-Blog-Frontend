import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { PuffLoader } from 'react-spinners'; // Import PuffLoader

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { setUserInfo } = useContext(UserContext);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while making the request

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Wrong Information');
      setLoading(false); // Reset loading to false on error
    }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        id="username"
        type="text"
        placeholder="username"
        autoComplete="true"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        id="password"
        type="password"
        placeholder="password"
        autoComplete="true"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={{ cursor: 'pointer' }}>Login</button>

      {loading &&
       <div className="loading-spinner">
           <PuffLoader color={'orange'} size={100} />
       </div>
       } {/* Show loader when loading */}
    </form>
  );
}
