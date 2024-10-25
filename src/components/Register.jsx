import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate an API call
    if (email === '' || password === '' || confirmPassword === '') {
      setError('All fields are required');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Simulate successful registration
      navigate('/Home');
    }
  };

  // Inline styles (same as Login.js)
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
      padding: '60px',
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
        <h2 style={{ fontWeight: 'bold', fontSize: '36px' }}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister} style={styles.loginForm}>
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
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p>
          Already have an account? <a href="/login"><strong>Login here</strong></a>
        </p>
      </div>
    </div>
  );
};

export default Register;