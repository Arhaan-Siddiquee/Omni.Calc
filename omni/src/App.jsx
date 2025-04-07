import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Casiofx_Classwiz from "./components/Casiofx-991EXClasswiz";
import Casiofx_ESPlus from "./components/Casiofx-991ESPlus";
import texasti from "./components/texas_ti";

// ============================================================
// CALCULATOR CONFIGURATION - Edit this array to add calculators
// ============================================================
const CALCULATORS = [
  {
    id: "fx-991ex-classwiz",
    name: "fx-991EX Classwiz",
    brand: "CASIO",
    path: "/calculator/fx-991ex-classwiz",
    component: Casiofx_Classwiz,
    description: "The next-generation scientific calculator with high-resolution display and intuitive design.",
    features: "552 functions",
    color: "purple", // Color theme for this calculator
    tags: ["scientific", "student", "natural display", "classwiz", "casio"]
  },
  {
    id: "fx-991es-plus",
    name: "fx-991ES Plus",
    brand: "CASIO",
    path: "/calculator/fx-991es-plus",
    component: Casiofx_ESPlus,
    description: "The reliable scientific calculator with natural textbook display and advanced functionality.",
    features: "417 functions",
    color: "blue", // Color theme for this calculator
    tags: ["scientific", "student", "natural display", "casio"]
  },
  {
    id: "ti-36x-pro-space",
    name: "TI-36X Pro Space Edition",
    brand: "Texas Instruments",
    path: "/calculator/ti-36x-pro-space",
    component: texasti,
    description: "Scientific calculator with minimalist space theme and full functionality",
    features: "110 functions",
    color: "green", // Color theme for this calculator
    tags: ["scientific", "space-theme", "minimalist", "texas-instruments", "animated"]
  },
  // Add more calculators here in the future
  // Example structure:
  // {
  //   id: "unique-id", // URL-friendly identifier
  //   name: "Display Name", // Shown to users
  //   brand: "Brand Name", // e.g., "CASIO", "TI", "HP"
  //   path: "/calculator/unique-id", // Route path
  //   component: ImportedComponent, // React component for this calculator
  //   description: "Short description of calculator",
  //   features: "Key feature highlight",
  //   color: "color-name", // Choose from: blue, purple, green, red, orange, teal
  //   tags: ["tag1", "tag2"] // For search functionality
  // }
];

// Color theme configurations
const COLOR_THEMES = {
  blue: {
    gradient: "from-blue-600 to-indigo-700",
    hoverGlow: "hover:shadow-blue-500/20",
    bgGradient: "from-blue-600/30 to-indigo-600/20",
    glowColor: "from-blue-500 to-indigo-600",
    textColor: "text-blue-400",
    bgSolid: "bg-blue-600",
  },
  purple: {
    gradient: "from-purple-600 to-pink-700",
    hoverGlow: "hover:shadow-purple-500/20",
    bgGradient: "from-purple-600/30 to-pink-600/20",
    glowColor: "from-purple-500 to-pink-600",
    textColor: "text-purple-400",
    bgSolid: "bg-purple-600",
  },
  green: {
    gradient: "from-green-600 to-teal-700",
    hoverGlow: "hover:shadow-green-500/20",
    bgGradient: "from-green-600/30 to-teal-600/20",
    glowColor: "from-green-500 to-teal-600",
    textColor: "text-green-400",
    bgSolid: "bg-green-600",
  },
  red: {
    gradient: "from-red-600 to-orange-700",
    hoverGlow: "hover:shadow-red-500/20",
    bgGradient: "from-red-600/30 to-orange-600/20",
    glowColor: "from-red-500 to-orange-600",
    textColor: "text-red-400",
    bgSolid: "bg-red-600",
  },
  orange: {
    gradient: "from-orange-600 to-amber-700",
    hoverGlow: "hover:shadow-orange-500/20",
    bgGradient: "from-orange-600/30 to-amber-600/20", 
    glowColor: "from-orange-500 to-amber-600",
    textColor: "text-orange-400",
    bgSolid: "bg-orange-600",
  },
  teal: {
    gradient: "from-teal-600 to-cyan-700",
    hoverGlow: "hover:shadow-teal-500/20",
    bgGradient: "from-teal-600/30 to-cyan-600/20",
    glowColor: "from-teal-500 to-cyan-600",
    textColor: "text-teal-400",
    bgSolid: "bg-teal-600",
  }
};

// Group calculators by brand for the browse view
const getCalculatorsByBrand = () => {
  const brands = {};
  CALCULATORS.forEach(calc => {
    if (!brands[calc.brand]) {
      brands[calc.brand] = [];
    }
    brands[calc.brand].push(calc);
  });
  return brands;
};

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
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const trail = useMouseTrail({ trailLength: 12, fadeTime: 800 });
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle the navigation menu on mobile
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      setIsSearching(true);
      const results = CALCULATORS.filter(calc => {
        const searchFields = [
          calc.name.toLowerCase(),
          calc.brand.toLowerCase(),
          calc.description.toLowerCase(),
          ...calc.tags
        ].join(' ');
        
        return searchFields.includes(term.toLowerCase());
      });
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  // Handle click outside search results to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearching(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close search results when navigating
  useEffect(() => {
    setIsSearching(false);
    setSearchTerm("");
    setShowMenu(false);
  }, [location]);

  // Get the appropriate title based on the current route
  const getPageTitle = () => {
    if (location.pathname === "/") {
      return "Calculator Hub";
    }
    
    if (location.pathname === "/browse") {
      return "Browse Calculators";
    }
    
    // Check if we're on a calculator page
    const calcPath = location.pathname.startsWith("/calculator/") ? 
      location.pathname : null;
      
    if (calcPath) {
      const calcId = calcPath.split("/calculator/")[1];
      const calc = CALCULATORS.find(c => c.id === calcId);
      return calc ? `${calc.brand} ${calc.name}` : "Calculator";
    }
    
    return "Calculator Hub";
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="text-5xl font-bold text-white mb-4 animate-pulse">Calculator Hub</div>
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

      {/* Navigation for Desktop */}
      <div className="hidden md:block">
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex flex-col items-center">
            {/* Search Bar */}
            <div className="mb-4 w-96 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search calculators..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md rounded-full py-2 px-4 pl-10 text-white border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search Results */}
              {isSearching && (
                <div 
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-md rounded-lg border border-gray-800 shadow-lg z-50 max-h-96 overflow-auto"
                >
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="p-2 text-xs text-gray-400 border-b border-gray-800">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </div>
                      <div className="p-2">
                        {searchResults.map(calc => (
                          <Link
                            key={calc.id}
                            to={calc.path}
                            className="block px-3 py-2 hover:bg-gray-800 rounded-lg flex items-center"
                          >
                            <div className={`w-2 h-12 ${COLOR_THEMES[calc.color].bgSolid} rounded-lg mr-3`}></div>
                            <div>
                              <div className="font-medium">{calc.name}</div>
                              <div className="text-sm text-gray-400">{calc.brand}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No calculators found. Try a different search term.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Main Navigation Menu */}
            <div className="flex bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-full p-1 shadow-lg border border-gray-800">
              <NavLink to="/" location={location}>
                Home
              </NavLink>
              <NavLink to="/browse" location={location}>
                Browse All
              </NavLink>
              {/* Featured Calculators in Nav - limit to 3 most popular */}
              {CALCULATORS.slice(0, 3).map(calc => (
                <NavLink 
                  key={calc.id} 
                  to={calc.path} 
                  location={location}
                  color={calc.color}
                >
                  {calc.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md">
          <div className="font-bold text-white">{getPageTitle()}</div>
          
          {/* Search Icon for Mobile */}
          <div className="flex items-center">
            <Link to="/search" className="mr-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            {/* Hamburger Menu Button */}
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
              to="/browse" 
              className={`py-3 px-4 rounded-lg mb-2 ${
                location.pathname === '/browse' ? 'bg-gradient-to-r from-green-600 to-teal-700' : 'hover:bg-gray-800'
              }`}
              onClick={() => setShowMenu(false)}
            >
              Browse All Calculators
            </Link>
            <div className="mb-2 px-4 text-gray-500 text-sm">Featured Calculators</div>
            {CALCULATORS.map(calc => (
              <Link 
                key={calc.id}
                to={calc.path} 
                className={`py-3 px-4 rounded-lg mb-2 ${
                  location.pathname === calc.path ? `bg-gradient-to-r ${COLOR_THEMES[calc.color].gradient}` : 'hover:bg-gray-800'
                }`}
                onClick={() => setShowMenu(false)}
              >
                {calc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto pt-32 px-4 pb-16 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage calculators={CALCULATORS} />} />
          <Route path="/browse" element={<BrowsePage calculators={CALCULATORS} />} />
          <Route path="/search" element={<SearchPage calculators={CALCULATORS} />} />
          
          {/* Dynamic routes for all calculators */}
          {CALCULATORS.map(calc => (
            <Route 
              key={calc.id}
              path={calc.path} 
              element={<calc.component />} 
            />
          ))}
        </Routes>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-gray-500 text-sm backdrop-filter backdrop-blur-md bg-black bg-opacity-40">
        <div className="container mx-auto">
          Calculator Hub • {new Date().getFullYear()}
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

// Navigation Link Component
function NavLink({ to, children, location, color = "blue" }) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = location.pathname === to;
  const gradientClass = color ? COLOR_THEMES[color].gradient : "from-blue-600 to-indigo-700";
  
  return (
    <Link
      to={to}
      className={`relative px-6 py-2 rounded-full transition-all duration-300 flex items-center ${
        isActive 
          ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg transform scale-105` 
          : "text-gray-300 hover:text-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <div className={`absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-30`}></div>
      )}
    </Link>
  );
}

// Calculator Card Component
function CalculatorCard({ calculator }) {
  const [isHovered, setIsHovered] = useState(false);
  const colorTheme = COLOR_THEMES[calculator.color || "blue"];
  
  return (
    <Link 
      to={calculator.path}
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800 transform transition-all duration-300 hover:scale-[1.02] ${colorTheme.hoverGlow}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${colorTheme.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none`}></div>
        
        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{calculator.brand}</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-white">{calculator.name}</h2>
        <p className="text-gray-300 mb-6 line-clamp-2">
          {calculator.description}
        </p>
        
        <div className="flex justify-between items-end">
          <span className={`${colorTheme.bgSolid} px-3 py-1 rounded-full text-sm`}>{calculator.features}</span>
          <div className={`${colorTheme.textColor} group-hover:translate-x-1 transition-transform duration-300`}>
            Try it →
          </div>
        </div>
        
        {isHovered && (
          <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r ${colorTheme.glowColor} rounded-full filter blur-3xl opacity-30 pointer-events-none`}></div>
        )}
      </div>
    </Link>
  );
}

// Home Page Component
function HomePage({ calculators }) {
  // Feature some calculators (top 4)
  const featuredCalculators = calculators.slice(0, 4);
  // Get recommended calculators (next 6)
  const recommendedCalculators = calculators.slice(0, Math.min(6, calculators.length));
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          Calculator Hub
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Experience precision and reliability with our collection of digital calculators.
          Choose your calculator model below to begin calculating with confidence.
        </p>
      </div>
      
      {/* Featured Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full max-w-5xl mt-8">
        {featuredCalculators.map(calculator => (
          <CalculatorCard key={calculator.id} calculator={calculator} />
        ))}
      </div>
      
      {/* Recommended Section */}
      {recommendedCalculators.length > 0 && (
        <div className="mt-16 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Recommended Calculators</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></div>
            </div>
            <Link to="/browse" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCalculators.map(calculator => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        </div>
      )}
      
      {/* Features section */}
      <div className="mt-16 w-full max-w-5xl">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Data Storage</h3>
            <p className="text-gray-400 text-sm">Save calculations, variables, and formulas for future reference and quick access.</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Natural Display</h3>
            <p className="text-gray-400 text-sm">Equations and formulas are displayed as they appear in textbooks for easier understanding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Browse Page Component
function BrowsePage({ calculators }) {
  const calculatorsByBrand = getCalculatorsByBrand();
  
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Browse All Calculators</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore our complete collection of calculators organized by brand.
          Find the perfect calculator for your specific needs.
        </p>
      </div>
      
      {Object.entries(calculatorsByBrand).map(([brand, brandCalculators]) => (
        <div key={brand} className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{brand}</h2>
            <div className="ml-4 h-px bg-gradient-to-r from-blue-500 to-transparent flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandCalculators.map(calculator => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Search Page Component (for mobile)
function SearchPage({ calculators }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      const results = calculators.filter(calc => {
        const searchFields = [
          calc.name.toLowerCase(),
          calc.brand.toLowerCase(),
          calc.description.toLowerCase(),
          ...calc.tags
        ].join(' ');
        
        return searchFields.includes(term.toLowerCase());
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <div className="pb-16">
      <div className="mb-4 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search calculators..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md rounded-lg py-3 px-4 pl-10 text-white border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute right-3 top-3 text-gray-400"
        >
          Cancel
        </button>
      </div>
      
      {searchTerm && (
        <div className="text-sm text-gray-400 mb-4">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
        </div>
      )}
      
      <div className="space-y-4">
        {searchResults.map(calc => (
          <Link
            key={calc.id}
            to={calc.path}
            className="block bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg border border-gray-800 p-4 hover:bg-gray-800"
          >
            <div className="flex items-center">
              <div className={`w-2 h-16 ${COLOR_THEMES[calc.color].bgSolid} rounded-lg mr-4`}></div>
              <div className="flex-1">
                <div className="text-lg font-medium">{calc.name}</div>
                <div className="text-sm text-gray-400">{calc.brand}</div>
                <div className="text-xs text-gray-500 mt-1">{calc.description}</div>
              </div>
            </div>
          </Link>
        ))}
        
        {searchTerm.length > 1 && searchResults.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No calculators found</div>
            <div className="text-sm text-gray-500">Try a different search term</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;