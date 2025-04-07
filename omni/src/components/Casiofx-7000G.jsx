import React, { useState, useEffect } from 'react';

const CasioFx7000G = () => {
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [formula, setFormula] = useState('');
  const [isNewEntry, setIsNewEntry] = useState(true);
  const [mode, setMode] = useState('comp'); // comp, stat, graph
  const [graphData, setGraphData] = useState([]);
  const [graphVisible, setGraphVisible] = useState(false);
  const [graphYMin, setGraphYMin] = useState(-10);
  const [graphYMax, setGraphYMax] = useState(10);
  const [graphXMin, setGraphXMin] = useState(-10);
  const [graphXMax, setGraphXMax] = useState(10);
  const [blinkState, setBlinkState] = useState(false);
  
  // Starfield animation
  const [stars, setStars] = useState([]);
  
  // Create stars for background animation
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1
      });
    }
    setStars(newStars);
    
    const interval = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          y: (star.y + star.speed) % 100,
          opacity: Math.max(0.3, Math.min(0.8, star.opacity + (Math.random() - 0.5) * 0.1))
        }))
      );
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Button press handler
  const handleButtonPress = (value) => {
    // Handle calculator logic based on button press
    switch (value) {
      case 'AC':
        setDisplay('0');
        setFormula('');
        setIsNewEntry(true);
        setGraphVisible(false);
        break;
        
      case 'DEL':
        if (display.length > 1 && !isNewEntry) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
          setIsNewEntry(true);
        }
        break;
        
      case '=':
        try {
          // For basic calculation mode
          if (mode === 'comp') {
            // Replace × with *, ÷ with /, and other necessary replacements
            let evalFormula = formula.replace(/×/g, '*').replace(/÷/g, '/');
            evalFormula = evalFormula.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos')
                                   .replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10')
                                   .replace(/ln/g, 'Math.log').replace(/√/g, 'Math.sqrt')
                                   .replace(/π/g, 'Math.PI').replace(/\^/g, '**');
            
            const result = eval(evalFormula);
            setDisplay(result.toString().slice(0, 10)); // Limit to 10 digits like original fx-7000G
            setFormula(result.toString());
          }
          // For graph mode - generate points for the formula
          else if (mode === 'graph') {
            const points = [];
            for (let x = graphXMin; x <= graphXMax; x += 0.5) {
              try {
                // Replace x in the formula and evaluate
                const evalFormula = formula.replace(/x/g, x)
                                          .replace(/×/g, '*').replace(/÷/g, '/')
                                          .replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos')
                                          .replace(/tan/g, 'Math.tan').replace(/log/g, 'Math.log10')
                                          .replace(/ln/g, 'Math.log').replace(/√/g, 'Math.sqrt')
                                          .replace(/π/g, 'Math.PI').replace(/\^/g, '**');
                
                const y = eval(evalFormula);
                points.push({ x, y });
              } catch (e) {
                // Skip points that cause errors
              }
            }
            setGraphData(points);
            setGraphVisible(true);
          }
        } catch (error) {
          setDisplay('Error');
        }
        setIsNewEntry(true);
        break;
        
      case 'MODE':
        // Cycle through modes: comp -> stat -> graph -> comp
        setMode(prevMode => {
          const modes = ['comp', 'stat', 'graph'];
          const currentIndex = modes.indexOf(prevMode);
          return modes[(currentIndex + 1) % modes.length];
        });
        setGraphVisible(false);
        setDisplay(mode === 'comp' ? 'STAT' : mode === 'stat' ? 'GRAPH' : 'COMP');
        setTimeout(() => setDisplay('0'), 1000);
        break;
        
      case 'M+':
        try {
          const currentValue = parseFloat(display);
          setMemory(memory + currentValue);
          setIsNewEntry(true);
        } catch (error) {
          setDisplay('Error');
        }
        break;
        
      case 'MR':
        setDisplay(memory.toString());
        if (isNewEntry) {
          setFormula(memory.toString());
        } else {
          setFormula(formula + memory.toString());
        }
        setIsNewEntry(false);
        break;
        
      case 'MC':
        setMemory(0);
        break;
        
      default:
        // Handle digits and operators
        if (isNewEntry) {
          if ('0123456789.'.includes(value)) {
            setDisplay(value === '.' ? '0.' : value);
            setFormula(value === '.' ? '0.' : value);
          } else {
            setFormula(display + value);
          }
          setIsNewEntry(false);
        } else {
          if (display === '0' && value !== '.') {
            setDisplay(value);
            setFormula(value);
          } else {
            setDisplay(display + value);
            setFormula(formula + value);
          }
        }
        break;
    }
  };
  
  // Generate the calculator buttons
  const renderButton = (label, value, className = "") => (
    <button 
      onClick={() => handleButtonPress(value || label)}
      className={`${className} bg-gray-800 text-white border border-gray-700 rounded-md p-1 m-1 text-xs sm:text-sm md:text-base hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95`}
    >
      {label}
    </button>
  );

  // Graph rendering function
  const renderGraph = () => {
    if (!graphVisible || graphData.length === 0) return null;
    
    // Scale points to fit the graph area
    const graphWidth = 240;
    const graphHeight = 64;
    
    const scaleX = graphWidth / (graphXMax - graphXMin);
    const scaleY = graphHeight / (graphYMax - graphYMin);
    
    // Create path data
    let pathData = "";
    graphData.forEach((point, index) => {
      const x = (point.x - graphXMin) * scaleX;
      const y = graphHeight - (point.y - graphYMin) * scaleY;
      
      if (index === 0) {
        pathData += `M ${x} ${y} `;
      } else {
        pathData += `L ${x} ${y} `;
      }
    });
    
    return (
      <svg className="bg-black border border-gray-700 rounded-md" width={graphWidth} height={graphHeight}>
        {/* Grid lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line 
            key={`vertical-${i}`}
            x1={i * (graphWidth / 10)} 
            y1={0} 
            x2={i * (graphWidth / 10)} 
            y2={graphHeight} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="1" 
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line 
            key={`horizontal-${i}`}
            x1={0} 
            y1={i * (graphHeight / 6)} 
            x2={graphWidth} 
            y2={i * (graphHeight / 6)} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="1" 
          />
        ))}
        
        {/* X and Y axis */}
        <line 
          x1={0} 
          y1={graphHeight / 2} 
          x2={graphWidth} 
          y2={graphHeight / 2} 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="1" 
        />
        <line 
          x1={graphWidth / 2} 
          y1={0} 
          x2={graphWidth / 2} 
          y2={graphHeight} 
          stroke="rgba(255,255,255,0.5)" 
          strokeWidth="1" 
        />
        
        {/* Graph line */}
        <path d={pathData} fill="none" stroke="white" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, index) => (
          <div 
            key={index} 
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: 'white',
              opacity: star.opacity
            }}
          />
        ))}
      </div>
      
      {/* Main calculator container */}
      <div className="relative z-10 max-w-sm w-full bg-gray-900 border-2 border-gray-800 rounded-lg shadow-2xl p-4 transform transition-all duration-300 hover:scale-105">
        {/* Calculator header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">CASIO</div>
          <div className="text-lg font-bold text-blue-300">fx-7000G</div>
          <div className="text-xs text-gray-400">GRAPHIC</div>
        </div>
        
        {/* Calculator display */}
        <div className="mb-4 bg-gray-800 p-2 rounded border border-gray-700">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className={mode === 'comp' ? 'text-green-400' : 'text-gray-500'}>COMP</span>
            <span className={mode === 'stat' ? 'text-green-400' : 'text-gray-500'}>STAT</span>
            <span className={mode === 'graph' ? 'text-green-400' : 'text-gray-500'}>GRAPH</span>
            <span className={memory !== 0 ? 'text-green-400' : 'text-gray-500'}>M</span>
          </div>
          
          {graphVisible ? (
            renderGraph()
          ) : (
            <div className="font-mono text-2xl bg-gray-900 border border-gray-700 p-2 rounded flex items-center justify-end h-16">
              {display}
              {!isNewEntry && blinkState && <span className="ml-1 inline-block w-2 h-4 bg-green-500 animate-blink"></span>}
            </div>
          )}
          
          <div className="text-xs mt-1 text-right text-gray-400 overflow-hidden whitespace-nowrap">
            {formula.length > 30 ? '...' + formula.slice(-30) : formula}
          </div>
        </div>
        
        {/* Calculator keypad */}
        <div className="grid grid-cols-5 gap-1">
          {/* Row 1 */}
          {renderButton('MODE', 'MODE', 'col-span-1')}
          {renderButton('DEL', 'DEL', 'col-span-1')}
          {renderButton('AC', 'AC', 'col-span-1')}
          {renderButton('(', '(', 'col-span-1')}
          {renderButton(')', ')', 'col-span-1')}
          
          {/* Row 2 */}
          {renderButton('sin', 'sin(', 'col-span-1')}
          {renderButton('cos', 'cos(', 'col-span-1')}
          {renderButton('tan', 'tan(', 'col-span-1')}
          {renderButton('÷', '÷', 'col-span-1')}
          {renderButton('×', '×', 'col-span-1')}
          
          {/* Row 3 */}
          {renderButton('log', 'log(', 'col-span-1')}
          {renderButton('ln', 'ln(', 'col-span-1')}
          {renderButton('√', '√(', 'col-span-1')}
          {renderButton('-', '-', 'col-span-1')}
          {renderButton('+', '+', 'col-span-1')}
          
          {/* Row 4 */}
          {renderButton('7', '7', 'col-span-1')}
          {renderButton('8', '8', 'col-span-1')}
          {renderButton('9', '9', 'col-span-1')}
          {renderButton('M+', 'M+', 'col-span-1')}
          {renderButton('MR', 'MR', 'col-span-1')}
          
          {/* Row 5 */}
          {renderButton('4', '4', 'col-span-1')}
          {renderButton('5', '5', 'col-span-1')}
          {renderButton('6', '6', 'col-span-1')}
          {renderButton('x^y', '^', 'col-span-1')}
          {renderButton('MC', 'MC', 'col-span-1')}
          
          {/* Row 6 */}
          {renderButton('1', '1', 'col-span-1')}
          {renderButton('2', '2', 'col-span-1')}
          {renderButton('3', '3', 'col-span-1')}
          {renderButton('π', 'π', 'col-span-1')}
          {renderButton('x', 'x', 'col-span-1')}
          
          {/* Row 7 */}
          {renderButton('0', '0', 'col-span-1')}
          {renderButton('.', '.', 'col-span-1')}
          {renderButton('EXP', 'E', 'col-span-1')}
          {renderButton('ANS', display, 'col-span-1')}
          {renderButton('=', '=', 'col-span-1 bg-blue-700 hover:bg-blue-600')}
        </div>
      </div>
      
      {/* Instruction text */}
      <div className="mt-4 text-xs text-gray-400 max-w-sm text-center">
        <p>Try the graphing mode: Press MODE twice, enter an equation like "sin(x)", and press =</p>
      </div>
    </div>
  );
};

export default CasioFx7000G;