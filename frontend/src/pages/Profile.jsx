import React from 'react';
import Navbar from '../components/Navbar';
import FloatingDock from '../components/FloatingDock';
import { MapPin, Link as LinkIcon, Calendar, Award, Code, ExternalLink } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-rgukt-slate flex flex-col font-sans">
      <Navbar isLanding={false} />

      <main className="flex-1 max-w-5xl mx-auto w-full pt-8 pb-60 px-4">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
          <div className="h-40 bg-gradient-to-r from-rgukt-maroon to-red-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="w-32 h-32 bg-rgukt-slate rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-rgukt-maroon shadow-md">
                UD
              </div>
              <button className="bg-white border border-slate-200 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                Edit Profile
              </button>
            </div>
            
            <h1 className="text-3xl font-black text-charcoal">Udaykumar Angari</h1>
            <p className="text-slate-600 font-medium mt-1">Full-Stack Developer | Mentor to 150+ Juniors</p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-1"><MapPin size={16} className="text-rgukt-maroon"/> RGUKT, Basar</div>
              <div className="flex items-center gap-1"><LinkIcon size={16} className="text-rgukt-maroon"/> udaykumar.dev</div>
              <div className="flex items-center gap-1"><Calendar size={16} className="text-rgukt-maroon"/> Joined Aug 2025</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-charcoal mb-4">On the Web</h3>
                <div className="space-y-3">
                    
                
                    <a href="https://github.com/udaykumar-angari" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-charcoal transition-all">
                    <div className="flex items-center gap-3">
                        <img 
                        src="https://www.vectorlogo.zone/logos/github/github-icon.svg" 
                        alt="GitHub" 
                        className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all"
                        />
                        <span className="text-sm font-bold group-hover:text-white transition-colors">GitHub</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-white transition-all" />
                    </a>

                
                    <a href="https://linkedin.com/in/udaykumar-angari" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-[#0077b5] transition-all">
                    <div className="flex items-center gap-3">
                        <img 
                        src="https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg" 
                        alt="LinkedIn" 
                        className="w-5 h-5  "
                        />
                        <span className="text-sm font-bold group-hover:text-white transition-colors">LinkedIn</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-white transition-all" />
                    </a>

                </div>
                </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-charcoal mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-rgukt-maroon">150+</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mentored</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-rgukt-maroon">12</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Projects</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                <Code className="text-rgukt-maroon" size={20}/> Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Java', 'Spring Boot', 'React', 'MongoDB', 'AWS S3', 'Docker', 'Kubernetes'].map(skill => (
                  <span key={skill} className="bg-rgukt-slate border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                <Award className="text-rgukt-maroon" size={20}/> Featured Projects
              </h3>
              <div className="space-y-4">
                <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl hover:border-rgukt-maroon/20 transition-all group cursor-pointer">
                  <h4 className="font-bold text-charcoal group-hover:text-rgukt-maroon text-lg">RGUKT Exam Notification Bot</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Telegram bot reaching 450+ students with real-time updates.</p>
                </div>
                <div className="p-5 border border-slate-50 bg-slate-50/30 rounded-2xl hover:border-rgukt-maroon/20 transition-all group cursor-pointer">
                  <h4 className="font-bold text-charcoal group-hover:text-rgukt-maroon text-lg">QR Intern Logger</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Visitor automation system for internships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingDock />
    </div>
  );
};

export default Profile;