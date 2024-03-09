import React, { useState } from 'react';
import { PuffLoader } from 'react-spinners'; // Import PuffLoader

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [err , SetErr] = useState('')

  async function register(e) {
    e.preventDefault();
    setLoading(true); // Set loading to true while making the request

    const res = await fetch('https://mern-blog-backend-hmpo.onrender.com:3001/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 200) {
      alert('Registration Successful');
    } else {
      // SetErr ='the user exist try to login'
      alert('Registration Failed');
    }

    setLoading(false); // Reset loading to false after the request
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      {/* <p>{err}</p> */}
      <input
        id="username"
        autoComplete="true"
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        id="password"
        autoComplete="true"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={{ cursor: 'pointer' }}>Register</button>

      {loading && 
      <div class="loading-spinner">
          <PuffLoader color={'orange'} size={100} />
      </div>
      } {/* Show loader when loading */}
    </form>
  );
}
