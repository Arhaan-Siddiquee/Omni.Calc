import React, { useState, useEffect } from 'react';

const CasioCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [secondaryDisplay, setSecondaryDisplay] = useState('');
  const [formula, setFormula] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [mode, setMode] = useState('COMP');
  const [angleUnit, setAngleUnit] = useState('DEG');
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);

  // Startup animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Calculator functions
  const clearAll = () => {
    setFormula('');
    setDisplay('0');
    setSecondaryDisplay('');
  };

  const evaluateExpression = () => {
    try {
      // Parse the formula for calculation
      let evalFormula = formula
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI')
        .replace(/\^/g, '**');
      
      // Convert to radians if needed
      if (angleUnit === 'DEG') {
        evalFormula = evalFormula
          .replace(/Math.sin\((.*?)\)/g, 'Math.sin($1 * Math.PI/180)')
          .replace(/Math.cos\((.*?)\)/g, 'Math.cos($1 * Math.PI/180)')
          .replace(/Math.tan\((.*?)\)/g, 'Math.tan($1 * Math.PI/180)');
      }
      
      // Evaluate and format
      const result = eval(evalFormula);
      let formattedResult;
      
      if (Math.abs(result) > 9999999999 || (Math.abs(result) < 0.0000001 && result !== 0)) {
        formattedResult = result.toExponential(6);
      } else {
        formattedResult = parseFloat(result.toFixed(10)).toString();
        // Remove trailing zeros after decimal point
        if (formattedResult.includes('.')) {
          formattedResult = formattedResult.replace(/\.?0+$/, '');
        }
      }
      
      setSecondaryDisplay(formula + '=');
      setDisplay(formattedResult);
      setFormula(formattedResult);
      
    } catch (error) {
      setDisplay('Math ERROR');
      setTimeout(() => {
        setDisplay(formula || '0');
      }, 1500);
    }
  };

  const handleInput = (value) => {
    // Reset shift and alpha for most operations
    const resetModifiers = () => {
      if (!['SHIFT', 'ALPHA'].includes(value)) {
        setShift(false);
        setAlpha(false);
      }
    };

    switch (value) {
      case 'AC':
        clearAll();
        resetModifiers();
        break;
        
      case 'DEL':
        if (formula.length > 0) {
          const newFormula = formula.slice(0, -1);
          setFormula(newFormula);
          setDisplay(newFormula || '0');
        }
        resetModifiers();
        break;
        
      case '=':
        evaluateExpression();
        resetModifiers();
        break;
        
      case 'SHIFT':
        setShift(!shift);
        break;
        
      case 'ALPHA':
        setAlpha(!alpha);
        break;
        
      case 'MODE':
        // Cycle through calculator modes
        const modes = ['COMP', 'STAT', 'TABLE', 'VECTOR', 'EQUATION'];
        const currentIndex = modes.indexOf(mode);
        setMode(modes[(currentIndex + 1) % modes.length]);
        resetModifiers();
        break;
        
      case 'DRG':
        // Cycle through angle units: DEG -> RAD -> GRAD
        const units = ['DEG', 'RAD', 'GRAD'];
        const currentUnit = units.indexOf(angleUnit);
        setAngleUnit(units[(currentUnit + 1) % units.length]);
        resetModifiers();
        break;
        
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
        setFormula(formula + value + '(');
        setDisplay(formula + value + '(');
        resetModifiers();
        break;
        
      case '√(':
        setFormula(formula + '√(');
        setDisplay(formula + '√(');
        resetModifiers();
        break;
        
      case 'π':
        setFormula(formula + 'π');
        setDisplay(formula + 'π');
        resetModifiers();
        break;
        
      case 'MR':
        setFormula(formula + memory.toString());
        setDisplay(formula + memory.toString());
        resetModifiers();
        break;
        
      case 'MC':
        setMemory(0);
        resetModifiers();
        break;
        
      case 'M+':
        try {
          const evalResult = eval(formula.replace(/×/g, '*').replace(/÷/g, '/'));
          setMemory(memory + parseFloat(evalResult));
        } catch (error) {
          // Silently handle error
        }
        resetModifiers();
        break;
        
      case 'M-':
        try {
          const evalResult = eval(formula.replace(/×/g, '*').replace(/÷/g, '/'));
          setMemory(memory - parseFloat(evalResult));
        } catch (error) {
          // Silently handle error
        }
        resetModifiers();
        break;
        
      default:
        // Handle numbers and operators
        if (formula === '0' && '0123456789'.includes(value)) {
          setFormula(value);
          setDisplay(value);
        } else {
          setFormula(formula + value);
          setDisplay(formula + value);
        }
        resetModifiers();
        break;
    }
  };

  // Calculator button component
  const Button = ({ label, value, secondaryLabel, className }) => {
    const buttonValue = value || label;
    
    return (
      <button
        onClick={() => handleInput(buttonValue)}
        className={`rounded-md text-center transition-all duration-200 flex flex-col justify-center items-center p-1 
                   active:scale-95 hover:bg-opacity-80 ${className}`}
      >
        {shift && secondaryLabel ? (
          <span className="text-yellow-300 text-xs">{secondaryLabel}</span>
        ) : (
          <span className="text-xs">{label}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(150).fill().map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 8 + 4}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Startup animation */}
      {showStartupAnimation && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="text-2xl font-bold text-white opacity-0 animate-pulse-fade">
            CASIO
          </div>
          <div className="text-lg font-bold text-gray-300 opacity-0 animate-rise">
            fx-991ES PLUS
          </div>
        </div>
      )}
      
      {/* Calculator body */}
      <div className={`w-80 bg-gray-900 rounded-2xl shadow-2xl p-4 transition-all duration-1000 relative ${
        showStartupAnimation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Solar panel */}
        <div className="absolute top-3 right-6 w-16 h-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded"></div>
        
        {/* Branding */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold">CASIO</div>
          <div className="text-xs text-gray-400">fx-991ES PLUS</div>
        </div>
        
        {/* Display */}
        <div className="bg-gray-200 rounded-md p-3 mb-4 h-24 flex flex-col">
          <div className="flex justify-between text-xs text-gray-800 mb-1">
            <div className="flex space-x-2">
              <span>{mode}</span>
              <span>{angleUnit}</span>
            </div>
            <div className="flex space-x-2">
              <span className={shift ? 'font-bold' : 'opacity-30'}>S</span>
              <span className={alpha ? 'font-bold' : 'opacity-30'}>A</span>
              <span className={memory !== 0 ? 'font-bold' : 'opacity-30'}>M</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 h-4 overflow-hidden">
            {secondaryDisplay}
          </div>
          <div className="text-right text-black font-medium text-xl mt-auto overflow-hidden">
            {display}
          </div>
        </div>
        
        {/* Keypad */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 */}
          <Button label="SHIFT" className="bg-yellow-700 text-white" />
          <Button label="ALPHA" className="bg-red-700 text-white" />
          <Button label="MODE" className="bg-gray-700" />
          <Button label="ON" value="AC" className="bg-red-800 col-span-2" />
          
          {/* Row 2 */}
          <Button label="√" value="√(" secondaryLabel="^3√" className="bg-gray-800" />
          <Button label="^" secondaryLabel="^2" className="bg-gray-800" />
          <Button label="log" secondaryLabel="10^" className="bg-gray-800" />
          <Button label="ln" secondaryLabel="e^" className="bg-gray-800" />
          <Button label="(-)" value="-" secondaryLabel="°'" className="bg-gray-800" />
          
          {/* Row 3 */}
          <Button label="hyp" secondaryLabel="pol" className="bg-gray-800" />
          <Button label="sin" secondaryLabel="sin^-1" className="bg-gray-800" />
          <Button label="cos" secondaryLabel="cos^-1" className="bg-gray-800" />
          <Button label="tan" secondaryLabel="tan^-1" className="bg-gray-800" />
          <Button label="DRG" className="bg-gray-800" />
          
          {/* Row 4 */}
          <Button label="ab/c" secondaryLabel="d/c" className="bg-gray-800" />
          <Button label="(" className="bg-gray-800" />
          <Button label=")" className="bg-gray-800" />
          <Button label="S⇔D" secondaryLabel="FIX" className="bg-gray-800" />
          <Button label="M+" secondaryLabel="M-" className="bg-gray-700" />
          
          {/* Row 5 */}
          <Button label="7" className="bg-gray-600" />
          <Button label="8" className="bg-gray-600" />
          <Button label="9" className="bg-gray-600" />
          <Button label="DEL" secondaryLabel="INS" className="bg-gray-700" />
          <Button label="AC" className="bg-gray-700" />
          
          {/* Row 6 */}
          <Button label="4" className="bg-gray-600" />
          <Button label="5" className="bg-gray-600" />
          <Button label="6" className="bg-gray-600" />
          <Button label="×" className="bg-gray-800" />
          <Button label="÷" className="bg-gray-800" />
          
          {/* Row 7 */}
          <Button label="1" className="bg-gray-600" />
          <Button label="2" className="bg-gray-600" />
          <Button label="3" className="bg-gray-600" />
          <Button label="+" className="bg-gray-800" />
          <Button label="-" className="bg-gray-800" />
          
          {/* Row 8 */}
          <Button label="0" className="bg-gray-600" />
          <Button label="." secondaryLabel="Ran#" className="bg-gray-600" />
          <Button label="π" secondaryLabel="e" className="bg-gray-800" />
          <Button label="Ans" secondaryLabel="DRG'" className="bg-gray-700" value="Ans" />
          <Button label="=" className="bg-blue-700" />
          
          {/* Row 9 */}
          <Button label="MR" secondaryLabel="STO" className="bg-gray-700" />
          <Button label="MC" secondaryLabel="RCL" className="bg-gray-700" />
          <Button label="M-" className="bg-gray-700" />
          <Button label="ENG" className="bg-gray-700" />
          <Button label="(" secondaryLabel=")" className="bg-gray-800" />
        </div>
        
        {/* Bottom label */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">NATURAL-V.P.A.M.</span>
        </div>
      </div>
      
      {/* Animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-fade {
          0% { opacity: 0; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        
        @keyframes rise {
          0% { opacity: 0; transform: translateY(20px); }
          40% { opacity: 0; }
          70% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-pulse-fade {
          animation: pulse-fade 2s ease-in-out forwards;
        }
        
        .animate-rise {
          animation: rise 2s ease-in-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default CasioCalculator;