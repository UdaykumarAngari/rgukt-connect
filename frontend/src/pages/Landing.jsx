import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Users, MessageSquare, Briefcase, GraduationCap, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import rguktBg from '../assets/rgukt_bg.png';

const Landing = ({ session, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#f9f6f0' }}>
      <Navbar isLanding={true} session={session} onLogout={onLogout} />
      
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 px-6 sm:py-32" style={{
          backgroundImage: `linear-gradient(to bottom, rgba(249, 246, 240, 0.82), rgba(249, 246, 240, 0.98)), url(${rguktBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rgukt-maroon/10 border border-rgukt-maroon/20 text-rgukt-maroon text-xs font-bold uppercase tracking-wider mb-6">
              <Award size={14} /> The Official RGUKT Network
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-charcoal leading-[1.15] tracking-tight">
              The Digital Bridge Between <br />
              <span className="bg-gradient-to-r from-rgukt-maroon to-rgukt-maroon/80 bg-clip-text text-transparent italic">
                Alumni & Students.
              </span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Connect with verified seniors, unlock direct job referrals, get career mentorship, and chat in real-time. Built exclusively for Rajiv Gandhi University of Knowledge Technologies.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 items-center">
              {session ? (
                <button 
                  onClick={() => navigate('/home')}
                  className="w-full sm:w-auto bg-rgukt-maroon hover:bg-rgukt-maroon/90 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-lg"
                >
                  Enter Platform <ChevronRight size={20} />
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto bg-rgukt-maroon hover:bg-rgukt-maroon/90 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-lg"
                  >
                    Get Started <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-white border border-slate-200 text-charcoal font-bold px-8 py-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer text-lg"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>
 
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-rgukt-maroon/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-rgukt-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        </section>
 
        <section className="bg-white py-12 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-rgukt-maroon">10k+</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Members</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-rgukt-maroon">5k+</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Verified Alumni</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-rgukt-maroon">15+</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Top Tech Companies</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-rgukt-maroon">24/7</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Peer Support</p>
            </div>
          </div>
        </section>
 
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-rgukt-maroon uppercase tracking-widest">Key Core Features</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-charcoal mt-2">Everything You Need To Grow</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex gap-5">
              <div className="w-12 h-12 bg-rgukt-maroon/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-rgukt-maroon">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-charcoal text-lg">Alumni Directory</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Search and connect with seniors filtered by graduation batch, branch, company role, and verified university status.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex gap-5">
              <div className="w-12 h-12 bg-rgukt-maroon/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-rgukt-maroon">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-charcoal text-lg">Real-Time Messaging</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Chat instantly with peers and mentors via our STOMP WebSocket broker. Secure, fast, and fully integrated.
                </p>
              </div>
            </div>
 
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex gap-5">
              <div className="w-12 h-12 bg-rgukt-maroon/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-rgukt-maroon">
                <Briefcase size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-charcoal text-lg">Referrals & Opportunities</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Apply directly for jobs and internships posted by active alumni. Skip the resume blackhole with direct referrals.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex gap-5">
              <div className="w-12 h-12 bg-rgukt-maroon/5 rounded-2xl flex-shrink-0 flex items-center justify-center text-rgukt-maroon">
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-charcoal text-lg">Verified Portfolios</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Showcase your real experience, verified projects, academic achievements, and graduation credentials.
                </p>
              </div>
            </div>
          </div>
        </section>
 
        <section className="bg-rgukt-maroon text-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} /> Trust & Safety
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready to Join the RGUKT Network?
            </h3>
            <p className="mt-4 text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Membership requires a valid RGUKT email (`@rgukt.ac.in` or `@rguktbasar.ac.in`) to ensure absolute platform authenticity.
            </p>
            <div className="mt-8 flex justify-center">
              {session ? (
                <button 
                  onClick={() => navigate('/home')}
                  className="bg-white text-rgukt-maroon font-bold px-8 py-3.5 rounded-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  Go to Feed
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-rgukt-maroon font-bold px-8 py-3.5 rounded-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  Create Account Now
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
 
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} RGUKT Connect. Rajiv Gandhi University of Knowledge Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;