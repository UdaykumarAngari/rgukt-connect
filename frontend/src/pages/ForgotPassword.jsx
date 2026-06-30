import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, KeyRound, Mail, ShieldAlert, CheckCircle, Network, Users, Globe, Share2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import rguktBg from '../assets/rgukt_bg.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setSuccessMessage(response.data.message || 'OTP sent successfully!');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) return;
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setSuccessMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Please check the OTP.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentWeekDays = () => {
        const days = [];
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDayOfWeek);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                dayNum: date.getDate(),
                isToday: date.toDateString() === today.toDateString(),
                isPast: date < today && date.toDateString() !== today.toDateString()
            });
        }
        return days;
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            backgroundImage: `url(${rguktBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <style>{`
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
                    margin: 0 0 24px 0;
                }
                .auth-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
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
                    padding: 13px 18px;
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
                    right: 18px;
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
                    padding: 14px;
                    border-radius: 24px;
                    border: none;
                    background: #ffcb45;
                    color: #1a1a1a;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    margin-top: 8px;
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
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .auth-success {
                    background-color: #def7ec;
                    border: 1px solid #bcf0da;
                    color: #03543f;
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 12px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
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
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 16px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    color: white;
                    animation: fadeInUp 0.8s ease 0.4s forwards, floatFast 5s ease-in-out infinite 1.5s;
                    opacity: 0;
                    z-index: 5;
                }

                /* Floating Icon styling */
                .floating-bg-icon {
                    position: absolute;
                    color: white;
                    z-index: 3;
                    pointer-events: none;
                }

                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes pulseOpacity {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.35; }
                }
                .network-line-anim {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: dash 5s linear infinite;
                }
                .network-line-anim-reverse {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: -1000;
                    animation: dash 6s linear infinite;
                }
                .network-node-glow {
                    animation: pulseOpacity 3s ease-in-out infinite;
                }
            `}</style>

            <div className="auth-card">
                <div className="auth-left">
                    <button className="logo-pill">RGUKT Connect</button>
                    
                    <div className="auth-form-container">
                        <h2 className="auth-title">
                            {step === 1 ? 'Reset Password' : 'Verify OTP'}
                        </h2>
                        <p className="auth-subtitle">
                            {step === 1 
                                ? 'Enter your university email to receive a password reset OTP.' 
                                : `We have sent a 6-digit OTP to ${email}.`}
                        </p>

                        {error && (
                            <div className="auth-error">
                                <ShieldAlert size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="auth-success">
                                <CheckCircle size={16} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp}>
                                <div className="auth-input-group">
                                    <label className="auth-label">University Email</label>
                                    <div className="auth-input-wrapper">
                                        <input 
                                            type="email" 
                                            placeholder="b21XXXX@rgukt.ac.in"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="auth-input"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="auth-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="auth-input-group">
                                    <label className="auth-label">Verification OTP</label>
                                    <div className="auth-input-wrapper">
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="auth-input"
                                            maxLength={6}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-label">New Password</label>
                                    <div className="auth-input-wrapper">
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="auth-input"
                                            required
                                            disabled={loading}
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

                                <div className="auth-input-group">
                                    <label className="auth-label">Confirm New Password</label>
                                    <div className="auth-input-wrapper">
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="auth-input"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="auth-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                            </form>
                        )}
                    </div>
                    
                    <div className="auth-footer">
                        <p className="auth-toggle-text">
                            Remember your password?{' '}
                            <span onClick={() => navigate('/login')} className="auth-link">
                                Back to login
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

export default ForgotPassword;
