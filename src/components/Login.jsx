import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate an API call
    if (email === 'test@example.com' && password === 'password') {
      // Redirect to the main page or dashboard
      navigate('/Home');
    } else {
      setError('Invalid email or password');
    }
  };

  // Inline styles
  const styles = {
    body: {
      margin: 0,
      padding: 0,
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginContainer: {
      textAlign: 'center',
      backgroundColor: 'white',
      padding: '100px',
      margin: '60px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    formGroup: {
      marginBottom: '20px',
      width: '100%', // Ensure full width for form groups
    },
    label: {
      marginBottom: '5px',
      display: 'block', // Ensure label takes full width
    },
    input: {
      padding: '10px',
      width: '300px',
      height: '40px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginTop: '5px', // Space between label and input
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '30px',
    },
    error: {
      color: 'red',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <h2 style={{ fontWeight: 'bold', fontSize: '36px' }}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.loginForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register"><strong>Register here</strong></a>
        </p>
      </div>
    </div>
  );
};

export default Login;