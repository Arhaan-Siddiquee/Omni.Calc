import React, { useState, useEffect } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [secondDisplay, setSecondDisplay] = useState('');
  const [memory, setMemory] = useState(0);
  const [mode, setMode] = useState('COMP'); // Default mode
  const [formula, setFormula] = useState('');
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [deg, setDeg] = useState(true);
  const [history, setHistory] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  // Calculator animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle calculator logic
  const handleInput = (value) => {
    // Animation for button press
    const animatePress = () => {
      // Reset shift and alpha after certain operations
      if (!['SHIFT', 'ALPHA'].includes(value)) {
        if (!['(', ')', '+', '-', '×', '÷', '^'].includes(value)) {
          setShift(false);
        }
        if (value !== 'ALPHA') {
          setAlpha(false);
        }
      }
    };

    // Handle special functions
    switch (value) {
      case 'ON/C':
        setDisplay('0');
        setSecondDisplay('');
        setFormula('');
        animatePress();
        break;
      case 'SHIFT':
        setShift(!shift);
        break;
      case 'ALPHA':
        setAlpha(!alpha);
        break;
      case 'MODE':
        // Cycle through modes: COMP -> STAT -> TABLE -> EQUA -> MATRIX -> VECTOR
        const modes = ['COMP', 'STAT', 'TABLE', 'EQUA', 'MATRIX', 'VECTOR'];
        const currentIndex = modes.indexOf(mode);
        setMode(modes[(currentIndex + 1) % modes.length]);
        animatePress();
        break;
      case 'DRG':
        setDeg(!deg);
        animatePress();
        break;
      case '=':
        try {
          // Prepare formula for evaluation
          let evalFormula = formula
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**');
            
          // Convert degrees to radians for trig functions if in DEG mode
          if (deg) {
            evalFormula = evalFormula
              .replace(/Math.sin\((.*?)\)/g, 'Math.sin($1 * Math.PI/180)')
              .replace(/Math.cos\((.*?)\)/g, 'Math.cos($1 * Math.PI/180)')
              .replace(/Math.tan\((.*?)\)/g, 'Math.tan($1 * Math.PI/180)');
          }
            
          // Evaluate and format result
          const result = eval(evalFormula);
          
          // Format scientific notation for very large or small numbers
          let formattedResult;
          if (Math.abs(result) > 9999999999 || (Math.abs(result) < 0.0000001 && result !== 0)) {
            formattedResult = result.toExponential(8);
          } else {
            formattedResult = parseFloat(result.toFixed(10)).toString();
          }
          
          setSecondDisplay(formula);
          setDisplay(formattedResult);
          setFormula(formattedResult);
          
          // Add to history
          setHistory([...history, { formula, result: formattedResult }]);
        } catch (error) {
          setDisplay('Math ERROR');
          setTimeout(() => setDisplay(formula || '0'), 2000);
        }
        animatePress();
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case 'sqrt':
        setFormula(formula + value + '(');
        setDisplay(formula + value + '(');
        animatePress();
        break;
      case 'π':
      case 'e':
        setFormula(formula + value);
        setDisplay(formula + value);
        animatePress();
        break;
      case 'DEL':
        if (formula.length > 0) {
          setFormula(formula.slice(0, -1));
          setDisplay(formula.slice(0, -1) || '0');
        }
        animatePress();
        break;
      case 'AC':
        setFormula('');
        setDisplay('0');
        animatePress();
        break;
      case 'MR':
        setFormula(formula + memory.toString());
        setDisplay(formula + memory.toString());
        animatePress();
        break;
      case 'MC':
        setMemory(0);
        animatePress();
        break;
      case 'M+':
        try {
          const evalResult = eval(formula.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
          setMemory(memory + evalResult);
        } catch (error) {
          // Handle error silently
        }
        animatePress();
        break;
      case 'M-':
        try {
          const evalResult = eval(formula.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
          setMemory(memory - evalResult);
        } catch (error) {
          // Handle error silently
        }
        animatePress();
        break;
      case '×':
      case '÷':
      case '+':
      case '-':
      case '(':
      case ')':
      case '.':
      case '^':
        setFormula(formula + value);
        setDisplay(formula + value);
        animatePress();
        break;
      default:
        if (!isNaN(parseInt(value)) || value === '.') {
          if (formula === '0' && value !== '.') {
            setFormula(value);
            setDisplay(value);
          } else {
            setFormula(formula + value);
            setDisplay(formula + value);
          }
        }
        animatePress();
        break;
    }
  };

  // Button component for calculator
  const Button = ({ label, value, className, secondaryLabel }) => {
    const handleClick = () => {
      handleInput(value || label);
    };

    const baseClasses = "flex flex-col items-center justify-center text-center rounded-md transition-all duration-200 select-none relative";
    
    return (
      <button 
        onClick={handleClick}
        className={`${baseClasses} ${className} active:scale-95 active:bg-gray-700 hover:bg-opacity-80`}
      >
        {shift && secondaryLabel ? (
          <span className="text-yellow-400">{secondaryLabel}</span>
        ) : (
          <span>{label}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-95 text-white overflow-hidden relative">
      {/* Star background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(100).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 5}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Initial animation */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-4xl font-bold text-white opacity-0 animate-fadeIn">
            CASIO fx-991EX
          </div>
        </div>
      )}
      
      {/* Calculator body */}
      <div className={`relative w-80 bg-gray-900 rounded-xl shadow-2xl p-4 transform transition-all duration-1000 ${showAnimation ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Solar panel */}
        <div className="absolute top-4 right-4 w-12 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-sm"></div>
        
        {/* Casio branding */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-white">CASIO</div>
          <div className="text-xs text-gray-400">fx-991EX</div>
        </div>
        
        {/* Calculator display */}
        <div className="bg-gray-200 p-3 rounded-md mb-4 h-24 overflow-hidden flex flex-col relative">
          <div className="text-xs text-gray-700 h-6 flex items-center">
            <span className="mr-2">{mode}</span>
            <span className="mr-2">{deg ? 'DEG' : 'RAD'}</span>
            <span className={`mr-2 ${shift ? 'text-black font-bold' : 'opacity-30'}`}>SHIFT</span>
            <span className={`mr-2 ${alpha ? 'text-black font-bold' : 'opacity-30'}`}>ALPHA</span>
            <span className={`mr-2 ${memory !== 0 ? 'text-black font-bold' : 'opacity-30'}`}>M</span>
          </div>
          <div className="text-xs text-gray-600 h-6 overflow-hidden">
            {secondDisplay}
          </div>
          <div className="text-right text-black font-medium text-xl h-12 overflow-hidden flex items-center justify-end">
            {display}
          </div>
        </div>
        
        {/* Calculator keypad */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 */}
          <Button label="SHIFT" className="bg-yellow-600 text-white text-xs" />
          <Button label="ALPHA" className="bg-red-600 text-white text-xs" />
          <Button label="MODE" className="bg-gray-700 text-white text-xs" />
          <Button label="ON/C" className="bg-red-700 text-white col-span-2 text-xs" />
          
          {/* Row 2 */}
          <Button label="√" value="sqrt" secondaryLabel="∛" className="bg-gray-800 text-xs" />
          <Button label="log" secondaryLabel="10^x" className="bg-gray-800 text-xs" />
          <Button label="ln" secondaryLabel="e^x" className="bg-gray-800 text-xs" />
          <Button label="(" className="bg-gray-800 text-xs" />
          <Button label=")" className="bg-gray-800 text-xs" />
          
          {/* Row 3 */}
          <Button label="sin" secondaryLabel="sin^-1" className="bg-gray-800 text-xs" />
          <Button label="cos" secondaryLabel="cos^-1" className="bg-gray-800 text-xs" />
          <Button label="tan" secondaryLabel="tan^-1" className="bg-gray-800 text-xs" />
          <Button label="x^" value="^" secondaryLabel="x√y" className="bg-gray-800 text-xs" />
          <Button label="DRG" className="bg-gray-800 text-xs" />
          
          {/* Row 4 */}
          <Button label="7" className="bg-gray-600" />
          <Button label="8" className="bg-gray-600" />
          <Button label="9" className="bg-gray-600" />
          <Button label="DEL" className="bg-gray-700 text-xs" />
          <Button label="AC" className="bg-gray-700 text-xs" />
          
          {/* Row 5 */}
          <Button label="4" className="bg-gray-600" />
          <Button label="5" className="bg-gray-600" />
          <Button label="6" className="bg-gray-600" />
          <Button label="×" className="bg-gray-800" />
          <Button label="÷" className="bg-gray-800" />
          
          {/* Row 6 */}
          <Button label="1" className="bg-gray-600" />
          <Button label="2" className="bg-gray-600" />
          <Button label="3" className="bg-gray-600" />
          <Button label="+" className="bg-gray-800" />
          <Button label="-" className="bg-gray-800" />
          
          {/* Row 7 */}
          <Button label="0" className="bg-gray-600" />
          <Button label="." className="bg-gray-600" />
          <Button label="π" secondaryLabel="e" className="bg-gray-800" />
          <Button label="Ans" className="bg-gray-800 text-xs" value="Ans" />
          <Button label="=" className="bg-blue-700" />
          
          {/* Row 8 */}
          <Button label="MR" className="bg-gray-700 text-xs" />
          <Button label="MC" className="bg-gray-700 text-xs" />
          <Button label="M+" className="bg-gray-700 text-xs" />
          <Button label="M-" className="bg-gray-700 text-xs" />
          <Button label="→" className="bg-gray-700 text-xs" />
        </div>
        
        {/* Classwiz label */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">ClassWiz</span>
        </div>
      </div>
      
      {/* CSS animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CalculatorApp;