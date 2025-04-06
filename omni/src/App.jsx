import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import BasicCalculator from "./components/Casiofx-991EXClasswiz";
import ScientificCalculator from "./components/Casiofx-991ESPlus";

function App() {
  return (
    <Router>
      <SpaceThemeLayout />
    </Router>
  );
}

// Custom hook for cursor trail effect
function useMouseTrail(options = {}) {
  const { trailLength = 20, fadeTime = 1000 } = options;
  const [trail, setTrail] = useState([]);
  
  useEffect(() => {
    const onMouseMove = (e) => {
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };
      
      setTrail(prevTrail => {
        const newTrail = [newDot, ...prevTrail].slice(0, trailLength);
        return newTrail;
      });
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Cleanup interval to remove old dots
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrail(prevTrail => 
        prevTrail.filter(dot => now - dot.timestamp < fadeTime)
      );
    }, 100);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearInterval(cleanup);
    };
  }, [trailLength, fadeTime]);
  
  return trail;
}

function SpaceThemeLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const trail = useMouseTrail({ trailLength: 12, fadeTime: 800 });
  const navRef = useRef(null);

  // Set active button based on current route
  useEffect(() => {
    setShowMenu(false);
    const path = location.pathname;
    if (path === "/") setActiveButton("home");
    else if (path === "/basic") setActiveButton("basic");
    else if (path === "/scientific") setActiveButton("scientific");
  }, [location]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle hover animations
  const handleHover = (button) => {
    setActiveButton(button);
  };

  // Toggle the navigation menu on mobile
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Get the appropriate title based on the current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "CASIO Calculator Hub";
      case "/basic":
        return "fx-991EX Classwiz";
      case "/scientific":
        return "fx-991ES Plus";
      default:
        return "CASIO Calculator Hub";
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="text-5xl font-bold text-white mb-4 animate-pulse">CASIO</div>
        <div className="h-1 w-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full">
          <div className="h-full w-1/3 bg-white rounded-full animate-loadingBar"></div>
        </div>
        <div className="text-gray-400 mt-4 animate-fadeIn">Loading Calculator Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Star background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array(200).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2.5 + 0.5}px`,
              height: `${Math.random() * 2.5 + 0.5}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 8 + 3}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Mouse trail effect */}
      {trail.map((dot, index) => {
        const opacity = 1 - (index / trail.length);
        const size = Math.max(4 - index * 0.3, 1);
        
        return (
          <div 
            key={index}
            className="absolute rounded-full pointer-events-none z-10 mix-blend-screen"
            style={{
              left: dot.x - size/2,
              top: dot.y - size/2,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              backgroundColor: `hsl(${(index * 10) + 200}, 100%, 70%)`,
              boxShadow: `0 0 ${size * 2}px ${size/2}px hsl(${(index * 10) + 200}, 100%, 70%)`,
              transition: 'all 0.1s linear'
            }}
          />
        );
      })}

      {/* 3D Rotating Navigation for Desktop */}
      <div className="hidden md:block">
        <nav ref={navRef} className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-full p-1 shadow-lg border border-gray-800">
            <Link
              to="/"
              className={`relative px-6 py-2 rounded-full transition-all duration-300 flex items-center ${
                activeButton === "home" 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105" 
                  : "text-gray-300 hover:text-white"
              }`}
              onMouseEnter={() => handleHover("home")}
            >
              <span className="relative z-10">Home</span>
              {activeButton === "home" && (
                <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-30"></div>
              )}
            </Link>
            <Link
              to="/basic"
              className={`relative px-6 py-2 rounded-full transition-all duration-300 flex items-center ${
                activeButton === "basic" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg transform scale-105" 
                  : "text-gray-300 hover:text-white"
              }`}
              onMouseEnter={() => handleHover("basic")}
            >
              <span className="relative z-10">fx-991EX Classwiz</span>
              {activeButton === "basic" && (
                <div className="absolute inset-0 rounded-full bg-purple-500 animate-pulse opacity-30"></div>
              )}
            </Link>
            <Link
              to="/scientific"
              className={`relative px-6 py-2 rounded-full transition-all duration-300 flex items-center ${
                activeButton === "scientific" 
                  ? "bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg transform scale-105" 
                  : "text-gray-300 hover:text-white"
              }`}
              onMouseEnter={() => handleHover("scientific")}
            >
              <span className="relative z-10">fx-991ES Plus</span>
              {activeButton === "scientific" && (
                <div className="absolute inset-0 rounded-full bg-indigo-500 animate-pulse opacity-30"></div>
              )}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md">
          <div className="font-bold text-white">{getPageTitle()}</div>
          <button 
            onClick={toggleMenu}
            className="w-10 h-10 relative focus:outline-none"
          >
            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span 
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  showMenu ? 'rotate-45' : '-translate-y-1.5'
                }`}
              ></span>
              <span 
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  showMenu ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span 
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  showMenu ? '-rotate-45' : 'translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
        </div>
        
        {/* Mobile menu dropdown */}
        <div 
          className={`fixed top-16 left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out ${
            showMenu ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col p-4">
            <Link 
              to="/" 
              className={`py-3 px-4 rounded-lg mb-2 ${
                location.pathname === '/' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => setShowMenu(false)}
            >
              Home
            </Link>
            <Link 
              to="/basic" 
              className={`py-3 px-4 rounded-lg mb-2 ${
                location.pathname === '/basic' ? 'bg-gradient-to-r from-purple-600 to-pink-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => setShowMenu(false)}
            >
              fx-991EX Classwiz
            </Link>
            <Link 
              to="/scientific" 
              className={`py-3 px-4 rounded-lg ${
                location.pathname === '/scientific' ? 'bg-gradient-to-r from-indigo-600 to-blue-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => setShowMenu(false)}
            >
              fx-991ES Plus
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto pt-24 px-4 pb-16 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basic" element={<BasicCalculator />} />
          <Route path="/scientific" element={<ScientificCalculator />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-gray-500 text-sm backdrop-filter backdrop-blur-md bg-black bg-opacity-40">
        <div className="container mx-auto">
          CASIO Calculator Hub • {new Date().getFullYear()}
        </div>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        .animate-loadingBar {
          animation: loadingBar 1.5s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Home Page Component
function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          CASIO Calculator Hub
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Experience the precision and reliability of CASIO calculators in digital form. 
          Choose your calculator model below to begin calculating with confidence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
        {/* fx-991EX Classwiz Card */}
        <Link 
          to="/basic"
          className="relative overflow-hidden group"
          onMouseEnter={() => setHoveredCard('classwiz')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">fx-991EX Classwiz</h2>
            <p className="text-gray-300 mb-6">
              The next-generation scientific calculator with high-resolution display and intuitive design.
            </p>
            
            <div className="flex justify-between items-end">
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">552 functions</span>
              <div className="text-purple-400 group-hover:translate-x-1 transition-transform duration-300">
                Try it →
              </div>
            </div>
            
            {hoveredCard === 'classwiz' && (
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
            )}
          </div>
        </Link>
        
        {/* fx-991ES Plus Card */}
        <Link 
          to="/scientific"
          className="relative overflow-hidden group"
          onMouseEnter={() => setHoveredCard('esplus')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">fx-991ES Plus</h2>
            <p className="text-gray-300 mb-6">
              The reliable scientific calculator with natural textbook display and advanced functionality.
            </p>
            
            <div className="flex justify-between items-end">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">417 functions</span>
              <div className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                Try it →
              </div>
            </div>
            
            {hoveredCard === 'esplus' && (
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
            )}
          </div>
        </Link>
      </div>
      
      {/* Featured section */}
      <div className="mt-16 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Calculator Features</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Scientific Functions</h3>
            <p className="text-gray-400 text-sm">Access hundreds of scientific functions including trigonometry, statistics, and complex calculations.</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Memory Functions</h3>
            <p className="text-gray-400 text-sm">Store variables and recall previous calculations easily with comprehensive memory functions.</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Natural Display</h3>
            <p className="text-gray-400 text-sm">View expressions and results in a natural textbook format for better understanding of mathematics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;