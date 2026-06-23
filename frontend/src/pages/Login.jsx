import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({
        universityEmail: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/auth/login', credentials);
            const { user, accessToken } = response.data;

            if (accessToken && user) {
                const sessionData = { 
                    token: accessToken, 
                    id: user.id, 
                    name: user.name, 
                    idNumber: user.idNumber, 
                    universityEmail: user.universityEmail 
                };
                localStorage.setItem('userSession', JSON.stringify(sessionData));
                onLoginSuccess(sessionData);
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login to RGUKT Connect</h2>
                <p style={styles.subtitle}>Enter your university credentials to access the portal</p>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>University Email</label>
                        <input 
                            type="email" 
                            name="universityEmail" 
                            placeholder="b21XXXX@rguktbasar.ac.in" 
                            value={credentials.universityEmail} 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>Sign In</button>
                </form>
                
                <p style={styles.toggleText}>
                    New to the platform?{' '}
                    <span onClick={() => navigate('/register')} style={styles.link}>
                        Create an account
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' },
    card: { width: '100%', maxWidth: '400px', padding: '40px 30px', border: '1px solid #e1e4e8', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)' },
    title: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' },
    subtitle: { margin: '0 0 24px 0', fontSize: '14px', color: '#666', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4a4a4a' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' },
    button: { padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
    error: { color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px 12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
    toggleText: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#4a4a4a' },
    link: { color: '#007bff', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }
};

export default Login;