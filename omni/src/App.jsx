import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Casiofx_Classwiz from "./components/Casiofx-991EXClasswiz";
import Casiofx_ESPlus from "./components/Casiofx-991ESPlus";
import texasti from "./components/texas_ti";
import Casiofx_GraphicG from "./components/Casiofx-7000G";

// Calculator definitions
const CALCULATORS = [
  {
    id: "fx-991ex-classwiz",
    name: "fx-991EX Classwiz",
    brand: "CASIO",
    path: "/calculator/fx-991ex-classwiz",
    component: Casiofx_Classwiz,
    description: "The next-generation scientific calculator with high-resolution display and intuitive design.",
    features: "552 functions",
    color: "blue", // Color theme for this calculator
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
    id: "Casio fx-7000G",
    name: "Casio fx-7000G Graphic Calculator",
    brand: "CASIO",
    path: "/calculator/ti-36x-pro-space",
    component: Casiofx_GraphicG,
    description: "Scientific calculator with Graph function made for students and professionals.",
    features: "82 functions",
    color: "blue", // Color theme for this calculator
    tags: ["scientific", "graphic", "minimalist", "graph", "7000G"]
  },
  {
    id: "ti-36x-pro-space",
    name: "TI-36X Pro Space Edition",
    brand: "Texas Instruments",
    path: "/calculator/ti-36x-pro-space",
    component: texasti,
    description: "Scientific calculator with minimalist space theme and full functionality",
    features: "110 functions",
    color: "yellow", // Color theme for this calculator
    tags: ["scientific", "space-theme", "minimalist", "texas-instruments", "animated"]
  },
];

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          {CALCULATORS.map((calc) => (
            <Route
              key={calc.id}
              path={calc.path}
              element={<CalcPage calculator={calc} />}
            />
          ))}
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home Page Component
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = CALCULATORS.filter(calc => {
      return (
        calc.name.toLowerCase().includes(query) ||
        calc.brand.toLowerCase().includes(query) ||
        calc.description.toLowerCase().includes(query) ||
        calc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });

    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowResults(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-bg"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Universal Calculator Library
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-200">
            Access any calculator in the market available, right from your browser.
          </p>
          
          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators by name, brand, or features..."
                className="w-full p-4 pl-12 rounded-full bg-gray-800 border border-blue-500/30 focus:border-blue-400 focus:ring focus:ring-blue-400/20 focus:outline-none text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 bg-blue-600 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-gray-800 border border-blue-500/30 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  <h3 className="text-sm text-gray-400 mb-2 px-2">Recommended Calculators</h3>
                  {searchResults.map((calc) => (
                    <Link
                      key={calc.id}
                      to={calc.path}
                      className="block px-4 py-3 hover:bg-gray-700 rounded-lg flex items-center transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      <div className={`w-3 h-10 rounded-sm mr-3 bg-${calc.color}-500`}></div>
                      <div>
                        <div className="font-medium">{calc.name}</div>
                        <div className="text-sm text-gray-400">{calc.brand} • {calc.features}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Calculators Grid */}
        <div className="mt-16 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATORS.map((calc) => (
              <Link
                key={calc.id}
                to={calc.path}
                className={`bg-gray-800 rounded-xl overflow-hidden border border-${calc.color}-500/30 hover:border-${calc.color}-400 transition-all hover:shadow-lg hover:shadow-${calc.color}-500/10 group`}
              >
                <div className={`h-2 bg-${calc.color}-500`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{calc.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{calc.brand} • {calc.features}</p>
                  <p className="text-gray-300 text-sm">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Calculator Page Component
function CalcPage({ calculator }) {
  const CalcComponent = calculator.component;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20">
          <div className={`h-2 bg-${calculator.color}-500`}></div>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{calculator.name}</h1>
            <p className="text-gray-400 mb-6">{calculator.brand} • {calculator.features}</p>
            
            <div className="calc-container">
              <CalcComponent />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Search Results Page
function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    if (query === '') {
      navigate('/');
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = CALCULATORS.filter(calc => {
      return (
        calc.name.toLowerCase().includes(lowerQuery) ||
        calc.brand.toLowerCase().includes(lowerQuery) ||
        calc.description.toLowerCase().includes(lowerQuery) ||
        calc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
    
    setSearchResults(results);
  }, [query, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">No calculators found matching your search</div>
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              Return to homepage
            </Link>
            <p>
              Or try searching for something else.


              ‎ 

            </p>
            <Link to="https://forms.gle/N8yLSQDYUGpSZZzK9" className="text-blue-400 hover:text-blue-300" >
              If it is not here then please suggest us to add it.
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((calc) => (
              <Link
                key={calc.id}
                to={calc.path}
                className={`bg-gray-800 rounded-xl overflow-hidden border border-${calc.color}-500/30 hover:border-${calc.color}-400 transition-all hover:shadow-lg hover:shadow-${calc.color}-500/10 group`}
              >
                <div className={`h-2 bg-${calc.color}-500`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{calc.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{calc.brand} • {calc.features}</p>
                  <p className="text-gray-300 text-sm">{calc.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {calc.tags.map((tag, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full bg-${calc.color}-900/30 text-${calc.color}-300`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

// 404 Page
function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-gray-400 mb-6">The calculator you're looking for doesn't exist in this universe.</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Return to Homepage
        </Link>
      </div>
      
      <Footer />
    </div>
  );
}

// Navbar Component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState({});
  
  useEffect(() => {
    // Group calculators by brand
    const brands = {};
    CALCULATORS.forEach(calc => {
      if (!brands[calc.brand]) {
        brands[calc.brand] = [];
      }
      brands[calc.brand].push(calc);
    });
    setCategories(brands);
  }, []);
  
  return (
    <nav className="bg-gray-900 border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-blue-500 w-8 h-8 rounded flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl">OmniCalc</span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {Object.keys(categories).map((brand) => (
                  <div key={brand} className="relative group">
                    <button className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white flex items-center">
                      {brand}
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-20">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {categories[brand].map((calc) => (
                          <Link
                            key={calc.id}
                            to={calc.path}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            role="menuitem"
                          >
                            {calc.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <p>
                This is Open Sourced so, Contibute Here  ‎⭐
              </p>
              <a href="https://github.com/Arhaan-Siddiquee/Omni.Calc" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {Object.keys(categories).map((brand) => (
            <div key={brand} className="py-2">
              <div className="px-3 py-2 text-base font-medium text-white">{brand}</div>
              <div className="pl-4">
                {categories[brand].map((calc) => (
                  <Link
                    key={calc.id}
                    to={calc.path}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {calc.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-blue-900/40 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="bg-blue-500 w-6 h-6 rounded flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">OmniCalc</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">All available calculators online library for free.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">

            <a href="https://x.com/ArhaanSiddique0" className="hover:text-white">Contact</a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} OmniVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Global CSS to add to your styles file
const globalStyles = `
/* Add this to your CSS/SCSS file */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, transparent 0%, #111827 100%);
  overflow: hidden;
}

.stars-bg:before, .stars-bg:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
    radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
    radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
  background-size: 550px 550px, 350px 350px, 250px 250px;
  background-position: 0 0, 40px 60px, 130px 270px;
  animation: twinkle 10s ease-in-out infinite alternate;
}

.stars-bg:after {
  background-size: 450px 450px, 250px 250px, 150px 150px;
  background-position: 50px 30px, 120px 90px, 200px 200px;
  animation: twinkle 12s ease-in-out infinite alternate-reverse;
  opacity: 0.5;
}

@keyframes twinkle {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

/* Calculator container styles */
.calc-container {
  background-color: rgba(15, 23, 42, 0.7);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}
`;

export default App;