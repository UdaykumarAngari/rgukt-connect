import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        universityEmail: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            // 🚀 Send data to your Spring Boot Register Endpoint
            await axios.post('/api/auth/register', formData);
            
            setMessage('Registration successful! Redirecting to login...');
            setFormData({ name: '', idNumber: '', universityEmail: '', password: '' });
            
            // 🕒 Wait 2 seconds so the user can read the success message, then route to login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your inputs.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join the RGUKT Connect network stream</p>
                
                {message && <div style={styles.success}>{message}</div>}
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Your Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>ID Number</label>
                        <input 
                            type="text" 
                            name="idNumber" 
                            placeholder="e.g., B211449" 
                            value={formData.idNumber} 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>University Email</label>
                        <input 
                            type="email" 
                            name="universityEmail" 
                            placeholder="b21XXXX@rguktbasar.ac.in" 
                            value={formData.universityEmail} 
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
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>Register</button>
                </form>
                
                <p style={styles.toggleText}>
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} style={styles.link}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        fontFamily: 'sans-serif'
    },
    card: { 
        width: '100%',
        maxWidth: '400px', 
        padding: '40px 30px', 
        border: '1px solid #e1e4e8', 
        borderRadius: '12px', 
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)' 
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center'
    },
    subtitle: {
        margin: '0 0 24px 0',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center'
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '18px' 
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4a4a4a'
    },
    input: { 
        padding: '12px', 
        borderRadius: '6px', 
        border: '1px solid #ccc', 
        fontSize: '14px', 
        outline: 'none'
    },
    button: { 
        padding: '12px', 
        background: '#28a745', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        fontSize: '16px',
        marginTop: '10px',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
    },
    success: { 
        color: '#155724', 
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        padding: '10px 12px',
        borderRadius: '6px',
        marginBottom: '20px', 
        fontSize: '14px' 
    },
    error: { 
        color: '#721c24', 
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px 12px',
        borderRadius: '6px',
        marginBottom: '20px', 
        fontSize: '14px' 
    },
    toggleText: { 
        textAlign: 'center', 
        marginTop: '24px', 
        fontSize: '14px',
        color: '#4a4a4a'
    },
    link: { 
        color: '#007bff', 
        cursor: 'pointer', 
        fontWeight: '600',
        textDecoration: 'underline' 
    }
};

export default Register;