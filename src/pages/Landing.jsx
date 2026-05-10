import React from 'react';
import { Link } from 'react-router-dom';  
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isLanding={true} />
      <main className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-sm font-bold text-rgukt-maroon uppercase tracking-[0.3em] mb-4">Our Mission</h2>
        <h3 className="text-5xl md:text-7xl font-extrabold text-charcoal leading-tight">
          The Digital Bridge Between <br />
          <span className="text-rgukt-maroon italic">Alumni & Students.</span>
        </h3>
        
        <div className="mt-12 flex justify-center">
          <Link 
            to="/home" 
            className="bg-rgukt-maroon text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all"
          >
            Explore Network
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;