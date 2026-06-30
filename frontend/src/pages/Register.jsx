import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Network, Users, Globe, Share2, MessageSquare } from 'lucide-react';
import rguktBg from '../assets/rgukt_bg.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        universityEmail: '',
        password: '',
        role: 'STUDENT'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const getCurrentWeekDays = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - currentDay);
        
        const days = [];
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date(sunday);
            tempDate.setDate(sunday.getDate() + i);
            days.push({
                dayNum: tempDate.getDate(),
                isToday: tempDate.toDateString() === today.toDateString(),
                isPast: i < currentDay
            });
        }
        return days;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post('/api/auth/register', formData);
            
            setMessage('Registration successful! Redirecting to login...');
            setFormData({ name: '', idNumber: '', universityEmail: '', password: '', role: 'STUDENT' });
 
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your inputs.');
        }
    };

    return (
        <div className="auth-container">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
                
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    background-image: linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url(${rguktBg});
                    background-size: cover;
                    background-position: center;
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    box-sizing: border-box;
                    z-index: 9999;
                }
                
                @keyframes cardEntrance {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .auth-card {
                    display: flex;
                    width: 1020px;
                    max-width: 100%;
                    height: 600px;
                    background-color: #f9f6f0;
                    border-radius: 40px;
                    padding: 16px;
                    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.3);
                    box-sizing: border-box;
                    gap: 16px;
                    animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .auth-left {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 20px 24px;
                    box-sizing: border-box;
                }
                .auth-right {
                    flex: 1.15;
                    position: relative;
                    border-radius: 32px;
                    overflow: hidden;
                }
                .auth-bg-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .auth-close-btn {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
                    transition: all 0.2s ease;
                    border: none;
                    z-index: 10;
                }
                .auth-close-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.12);
                }
                .logo-pill {
                    border: 1px solid #e2dfd7;
                    padding: 8px 20px;
                    border-radius: 24px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #4a4a4a;
                    align-self: flex-start;
                    background: transparent;
                }
                .auth-form-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex-grow: 1;
                }
                .auth-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.5px;
                }
                .auth-subtitle {
                    font-size: 13px;
                    color: #7a766e;
                    margin: 0 0 16px 0;
                }
                .auth-form-row {
                    display: flex;
                    gap: 12px;
                }
                .auth-form-row > .auth-input-group {
                    flex: 1;
                }
                .auth-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 12px;
                }
                .auth-label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #7a766e;
                    padding-left: 4px;
                }
                .auth-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .auth-input {
                    width: 100%;
                    padding: 11px 18px;
                    border-radius: 24px;
                    border: 1px solid transparent;
                    background-color: #f3f1eb;
                    font-size: 13px;
                    color: #1a1a1a;
                    outline: none;
                    transition: all 0.25s ease;
                    box-sizing: border-box;
                }
                .auth-input:focus {
                    background-color: #ffffff;
                    border-color: #ffcb45;
                    box-shadow: 0 0 0 4px rgba(255, 203, 69, 0.15);
                }
                .auth-password-toggle {
                    position: absolute;
                    right: 16px;
                    background: none;
                    border: none;
                    color: #7a766e;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0;
                }
                .auth-submit-btn {
                    width: 100%;
                    padding: 13px;
                    border-radius: 24px;
                    border: none;
                    background: #ffcb45;
                    color: #1a1a1a;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    margin-top: 6px;
                    box-shadow: 0 8px 20px rgba(255, 203, 69, 0.25);
                }
                .auth-submit-btn:hover {
                    background: #f5bc2c;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 24px rgba(255, 203, 69, 0.35);
                }
                .auth-submit-btn:active {
                    transform: translateY(1px);
                }
                .auth-toggle-text {
                    font-size: 13px;
                    color: #7a766e;
                    margin: 0;
                }
                .auth-link {
                    color: #1a1a1a;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .auth-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                }
                .auth-error {
                    background-color: #fde8e8;
                    border: 1px solid #fbd5d5;
                    color: #9b1c1c;
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 12px;
                    margin-bottom: 12px;
                }
                .auth-success {
                    background-color: #edfcf2;
                    border: 1px solid #def7ec;
                    color: #03543f;
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 12px;
                    margin-bottom: 12px;
                }

                /* Floating Widgets & Animations */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatSlow {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes floatMedium {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes floatFast {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }

                .widget-task {
                    position: absolute;
                    top: 32px;
                    left: 32px;
                    background: #ffcb45;
                    padding: 12px 20px;
                    border-radius: 16px;
                    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
                    font-size: 12px;
                    color: #1a1a1a;
                    animation: fadeInUp 0.8s ease forwards, floatSlow 6s ease-in-out infinite 0.8s;
                    z-index: 5;
                }
                .widget-meeting {
                    position: absolute;
                    bottom: 120px;
                    left: 32px;
                    background: white;
                    padding: 16px;
                    border-radius: 20px;
                    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.15);
                    width: 210px;
                    animation: fadeInUp 0.8s ease 0.2s forwards, floatMedium 7s ease-in-out infinite 1s;
                    opacity: 0;
                    z-index: 5;
                }
                .widget-calendar {
                    position: absolute;
                    bottom: 32px;
                    right: 32px;
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 16px 20px;
                    border-radius: 20px;
                    color: white;
                    box-shadow: 0 16px 32px rgba(0,0,0,0.1);
                    animation: fadeInUp 0.8s ease 0.4s forwards, floatFast 5s ease-in-out infinite 1.2s;
                    opacity: 0;
                    z-index: 5;
                }

                @media (max-width: 900px) {
                    .auth-card {
                        height: auto;
                        max-height: 90vh;
                        max-width: 440px;
                        flex-direction: column;
                        padding: 24px;
                        overflow-y: auto;
                    }
                    .auth-right {
                        display: none;
                    }
                    .auth-left {
                        padding: 10px 0;
                    }
                }

                @keyframes dash {
                    to {
                        stroke-dashoffset: -40;
                    }
                }
                .network-line-anim {
                    stroke-dasharray: 6, 6;
                    animation: dash 8s linear infinite;
                }
                .network-line-anim-reverse {
                    stroke-dasharray: 8, 8;
                    animation: dash 12s linear infinite reverse;
                }
                @keyframes pulseOpacity {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
                .network-node-glow {
                    animation: pulseOpacity 3s ease-in-out infinite;
                }
                .floating-bg-icon {
                    position: absolute;
                    color: white;
                    pointer-events: none;
                    z-index: 3;
                    transition: all 0.3s ease;
                }
            `}</style>

            <div className="auth-card">
                <div className="auth-left">
                    <div className="logo-pill">RGUKT Connect</div>
                    
                    <div className="auth-form-container">
                        <h2 className="auth-title">Create an account</h2>
                        <p className="auth-subtitle">Join the RGUKT Connect network stream</p>
                        
                        {message && <div className="auth-success">{message}</div>}
                        {error && <div className="auth-error">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="auth-form-row">
                                <div className="auth-input-group">
                                    <label className="auth-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Your Name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                        className="auth-input"
                                    />
                                </div>
                                
                                <div className="auth-input-group">
                                    <label className="auth-label">ID Number</label>
                                    <input 
                                        type="text" 
                                        name="idNumber" 
                                        placeholder="e.g., B211449" 
                                        value={formData.idNumber} 
                                        onChange={handleChange} 
                                        required 
                                        className="auth-input"
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">University Email</label>
                                <input 
                                    type="email" 
                                    name="universityEmail" 
                                    placeholder="b21XXXX@rgukt.ac.in" 
                                    value={formData.universityEmail} 
                                    onChange={handleChange} 
                                    required 
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-form-row">
                                <div className="auth-input-group" style={{ flex: 1.2 }}>
                                    <label className="auth-label">Password</label>
                                    <div className="auth-input-wrapper">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            placeholder="••••••••" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                            className="auth-input"
                                        />
                                        <button 
                                            type="button" 
                                            className="auth-password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-input-group" style={{ flex: 0.8 }}>
                                    <label className="auth-label">Role</label>
                                    <select 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="auth-input"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="ALUMNI">Alumni</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn">Register</button>
                        </form>
                    </div>
                    
                    <div className="auth-footer">
                        <p className="auth-toggle-text">
                            Already have an account?{' '}
                            <span onClick={() => navigate('/login')} className="auth-link">
                                Login here
                            </span>
                        </p>
                        <span style={{ fontSize: '12px', color: '#7a766e', textDecoration: 'underline', cursor: 'pointer' }}>Terms & Conditions</span>
                    </div>
                </div>

                <div className="auth-right">
                    <button className="auth-close-btn" onClick={() => navigate('/')}>
                        <X size={18} className="text-slate-600" />
                    </button>
                    
                    <img src={rguktBg} alt="RGUKT Campus" className="auth-bg-img" />
                    
                    {/* Dark gradient overlay for contrast */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.55) 100%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }} />

                    {/* Animated SVG Network Connections */}
                    <svg className="network-svg" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 2
                    }}>
                        <path d="M50,120 L150,90 L220,220 L100,320 L50,120 Z" stroke="rgba(255, 203, 69, 0.35)" strokeWidth="1.5" className="network-line-anim" />
                        <path d="M150,90 L300,130 L350,270 L220,220 Z" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                        <path d="M100,320 L260,370 L350,270 L220,220 Z" stroke="rgba(255, 203, 69, 0.25)" strokeWidth="1.5" />
                        <path d="M260,370 L310,520 L160,560 L100,320 Z" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" className="network-line-anim-reverse" />
                        <path d="M300,130 L380,230 L350,270 Z" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                        
                        <circle cx="50" cy="120" r="4" fill="#ffcb45" className="network-node-glow" />
                        <circle cx="150" cy="90" r="3.5" fill="#ffffff" />
                        <circle cx="300" cy="130" r="5" fill="#ffcb45" className="network-node-glow" />
                        <circle cx="220" cy="220" r="4" fill="#ffffff" />
                        <circle cx="100" cy="320" r="5" fill="#ffcb45" className="network-node-glow" />
                        <circle cx="350" cy="270" r="3.5" fill="#ffffff" />
                        <circle cx="260" cy="370" r="4.5" fill="#ffcb45" className="network-node-glow" />
                        <circle cx="310" cy="520" r="3.5" fill="#ffffff" />
                        <circle cx="160" cy="560" r="5" fill="#ffcb45" className="network-node-glow" />
                        <circle cx="380" cy="230" r="3.5" fill="#ffffff" />
                    </svg>

                    {/* Floating Community/Networking Icons */}
                    <div className="floating-bg-icon" style={{ top: '18%', right: '22%', animation: 'floatSlow 6s ease-in-out infinite' }}>
                        <Network size={24} style={{ opacity: 0.35 }} />
                    </div>
                    <div className="floating-bg-icon" style={{ top: '45%', right: '8%', animation: 'floatMedium 7s ease-in-out infinite 1s' }}>
                        <Users size={20} style={{ opacity: 0.3 }} />
                    </div>
                    <div className="floating-bg-icon" style={{ top: '28%', left: '38%', animation: 'floatFast 5s ease-in-out infinite 0.5s' }}>
                        <Globe size={22} style={{ opacity: 0.3 }} />
                    </div>
                    <div className="floating-bg-icon" style={{ bottom: '38%', left: '12%', animation: 'floatSlow 8s ease-in-out infinite 1.5s' }}>
                        <Share2 size={18} style={{ opacity: 0.35 }} />
                    </div>
                    <div className="floating-bg-icon" style={{ bottom: '25%', right: '35%', animation: 'floatMedium 6s ease-in-out infinite 2s' }}>
                        <MessageSquare size={20} style={{ opacity: 0.25 }} />
                    </div>
                    
                    <div className="widget-task">
                        <div style={{ fontSize: '10px', color: '#8d6e00', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '2px' }}>Upcoming Event</div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#1a1a1a' }}>Alumni Meet 2026</div>
                        <div style={{ fontSize: '10px', color: '#5f4d00', marginTop: '4px', fontWeight: '600' }}>10:00 AM - 01:00 PM</div>
                    </div>

                    <div className="widget-meeting">
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#1a1a1a', marginBottom: '2px' }}>Plenary Session</div>
                        <div style={{ fontSize: '11px', color: '#7a766e', marginBottom: '10px', fontWeight: '500' }}>12:00 PM - 01:00 PM</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ffcb45', border: '2px solid white', display: 'flex', alignItems: 'center', fontSize: '8px', fontWeight: 'bold', justifyContent: 'center', color: '#1a1a1a' }}>U</div>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#007bff', border: '2px solid white', marginLeft: '-6px', display: 'flex', alignItems: 'center', fontSize: '8px', fontWeight: 'bold', justifyContent: 'center', color: 'white' }}>A</div>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#28a745', border: '2px solid white', marginLeft: '-6px', display: 'flex', alignItems: 'center', fontSize: '8px', fontWeight: 'bold', justifyContent: 'center', color: 'white' }}>S</div>
                            </div>
                            <span style={{ fontSize: '10px', color: '#7a766e', fontWeight: '700' }}>+120 attending</span>
                        </div>
                    </div>

                    <div className="widget-calendar" style={{ width: '180px', boxSizing: 'border-box' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '10px', fontWeight: '700', opacity: 0.8, marginBottom: '6px' }}>
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '12px', fontWeight: '800', alignItems: 'center' }}>
                            {getCurrentWeekDays().map((day, idx) => (
                                <span 
                                    key={idx} 
                                    style={day.isToday ? { 
                                        color: '#ffcb45', 
                                        borderBottom: '2px solid #ffcb45', 
                                        paddingBottom: '2px',
                                        display: 'inline-block'
                                    } : { 
                                        opacity: day.isPast ? 0.5 : 1
                                    }}
                                >
                                    {day.dayNum}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;