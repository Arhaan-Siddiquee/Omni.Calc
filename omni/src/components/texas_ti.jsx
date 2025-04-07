import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';

const TI36XPro = () => {
  const [display, setDisplay] = useState('0');
  const [secondFunction, setSecondFunction] = useState(false);
  const [memory, setMemory] = useState(null);
  const [operation, setOperation] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [history, setHistory] = useState([]);
  const [shift, setShift] = useState(false);
  const [deg, setDeg] = useState(true); // true for DEG, false for RAD
  const [floatFixed, setFloatFixed] = useState('FLOAT'); // 'FLOAT', 'FIX 2', etc.
  const [stars, setStars] = useState([]);
  
  // Generate random stars for the background
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        animationDuration: Math.random() * 5 + 3
      });
    }
    setStars(newStars);
  }, []);

  const handleNumberClick = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimalClick = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperatorClick = (op) => {
    try {
      const current = parseFloat(display);
      setPreviousValue(current);
      setOperation(op);
      setDisplay('0');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      try {
        let result;
        const current = parseFloat(display);
        
        switch (operation) {
          case '+':
            result = previousValue + current;
            break;
          case '-':
            result = previousValue - current;
            break;
          case '*':
            result = previousValue * current;
            break;
          case '/':
            if (current === 0) {
              throw new Error('Division by zero');
            }
            result = previousValue / current;
            break;
          case '^':
            result = Math.pow(previousValue, current);
            break;
          default:
            result = current;
        }
        
        setHistory([...history, `${previousValue} ${operation} ${current} = ${result}`]);
        setDisplay(result.toString());
        setPreviousValue(null);
        setOperation(null);
      } catch (e) {
        setDisplay('Error');
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperation(null);
    setPreviousValue(null);
  };

  const handleAllClear = () => {
    handleClear();
    setHistory([]);
    setMemory(null);
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleMemoryStore = () => {
    try {
      const value = parseFloat(display);
      setMemory(value);
    } catch (e) {
      // Do nothing if not a valid number
    }
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplay(memory.toString());
    }
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleMemoryAdd = () => {
    if (memory !== null) {
      try {
        const value = parseFloat(display);
        setMemory(memory + value);
      } catch (e) {
        // Do nothing if not a valid number
      }
    } else {
      handleMemoryStore();
    }
  };

  const handleSecondFunction = () => {
    setSecondFunction(!secondFunction);
  };

  const handleShift = () => {
    setShift(!shift);
  };

  const handleToggleDegRad = () => {
    setDeg(!deg);
  };

  const handleFunction = (func) => {
    try {
      const value = parseFloat(display);
      let result;
      
      switch (func) {
        case 'sin':
          if (deg) {
            result = Math.sin(value * Math.PI / 180);
          } else {
            result = Math.sin(value);
          }
          break;
        case 'cos':
          if (deg) {
            result = Math.cos(value * Math.PI / 180);
          } else {
            result = Math.cos(value);
          }
          break;
        case 'tan':
          if (deg) {
            result = Math.tan(value * Math.PI / 180);
          } else {
            result = Math.tan(value);
          }
          break;
        case 'asin':
          result = Math.asin(value);
          if (deg) {
            result = result * 180 / Math.PI;
          }
          break;
        case 'acos':
          result = Math.acos(value);
          if (deg) {
            result = result * 180 / Math.PI;
          }
          break;
        case 'atan':
          result = Math.atan(value);
          if (deg) {
            result = result * 180 / Math.PI;
          }
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'x2':
          result = value * value;
          break;
        case '1/x':
          if (value === 0) {
            throw new Error('Division by zero');
          }
          result = 1 / value;
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        case 'exp':
          result = Math.exp(value);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = value;
      }
      
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handlePercent = () => {
    try {
      const value = parseFloat(display);
      const result = value / 100;
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleToggleSign = () => {
    if (display !== '0' && display !== 'Error') {
      if (display.startsWith('-')) {
        setDisplay(display.substring(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const handleFloatFixed = () => {
    const options = ['FLOAT', 'FIX 2', 'FIX 4', 'SCI 2', 'ENG 2'];
    const currentIndex = options.indexOf(floatFixed);
    const nextIndex = (currentIndex + 1) % options.length;
    setFloatFixed(options[nextIndex]);
  };

  // Button styling
  const buttonBase = "flex items-center justify-center text-white rounded-lg transition-all duration-300 hover:bg-gray-700 active:scale-95 active:bg-gray-600";
  const numButton = `${buttonBase} bg-gray-800`;
  const opButton = `${buttonBase} bg-gray-700`;
  const funcButton = `${buttonBase} bg-gray-900`;
  const specialButton = `${buttonBase} bg-blue-900`;
  const secondFuncActive = "bg-blue-700";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-black text-white p-4">
      {/* Stars background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
        {stars.map((star, i) => (
          <div 
            key={i} 
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: `twinkle ${star.animationDuration}s infinite alternate`
            }}
          />
        ))}
        <style jsx>{`
          @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 0.8; }
          }
        `}</style>
      </div>
      
      {/* Calculator body */}
      <div className="relative z-10 bg-black border border-gray-800 rounded-xl p-4 shadow-2xl w-full max-w-md">
        {/* Calculator name */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">Texas Instruments</div>
          <div className="text-xl font-bold text-white">TI-36X Pro</div>
        </div>
        
        {/* Display area */}
        <div className="bg-gray-900 mb-6 rounded-lg p-3 relative overflow-hidden">
          <div className="absolute top-2 right-2 flex space-x-2 text-xs text-gray-500">
            {memory !== null && <div>M</div>}
            {secondFunction && <div>2nd</div>}
            {shift && <div>SHIFT</div>}
            <div>{deg ? 'DEG' : 'RAD'}</div>
            <div>{floatFixed}</div>
          </div>
          <div className="flex justify-end text-3xl font-mono mt-4 overflow-x-auto scrollbar-hide">
            {display}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 */}
          <button className={`${specialButton} ${secondFunction ? secondFuncActive : ''}`} onClick={handleSecondFunction}>
            2nd
          </button>
          <button className={`${specialButton} ${shift ? secondFuncActive : ''}`} onClick={handleShift}>
            SHIFT
          </button>
          <button className={specialButton} onClick={handleToggleDegRad}>
            {deg ? 'DEG' : 'RAD'}
          </button>
          <button className={specialButton} onClick={handleFloatFixed}>
            {floatFixed}
          </button>
          <button className={funcButton} onClick={handleAllClear}>
            AC
          </button>
          
          {/* Row 2 */}
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('pi') : handleFunction('asin')}>
            {secondFunction ? 'π' : 'sin⁻¹'}
          </button>
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('e') : handleFunction('acos')}>
            {secondFunction ? 'e' : 'cos⁻¹'}
          </button>
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('x2') : handleFunction('atan')}>
            {secondFunction ? 'x²' : 'tan⁻¹'}
          </button>
          <button className={opButton} onClick={handleClear}>
            C
          </button>
          <button className={opButton} onClick={handleBackspace}>
            ⌫
          </button>
          
          {/* Row 3 */}
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('1/x') : handleFunction('sin')}>
            {secondFunction ? '1/x' : 'sin'}
          </button>
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('sqrt') : handleFunction('cos')}>
            {secondFunction ? '√' : 'cos'}
          </button>
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('exp') : handleFunction('tan')}>
            {secondFunction ? 'EXP' : 'tan'}
          </button>
          <button className={opButton} onClick={() => handleOperatorClick('^')}>
            x^y
          </button>
          <button className={opButton} onClick={() => handleOperatorClick('/')}>
            ÷
          </button>
          
          {/* Row 4 */}
          <button className={funcButton} onClick={() => secondFunction ? handleFunction('abs') : handleFunction('log')}>
            {secondFunction ? '|x|' : 'log'}
          </button>
          <button className={numButton} onClick={() => handleNumberClick('7')}>
            7
          </button>
          <button className={numButton} onClick={() => handleNumberClick('8')}>
            8
          </button>
          <button className={numButton} onClick={() => handleNumberClick('9')}>
            9
          </button>
          <button className={opButton} onClick={() => handleOperatorClick('*')}>
            ×
          </button>
          
          {/* Row 5 */}
          <button className={funcButton} onClick={() => secondFunction ? handleMemoryClear : handleFunction('ln')}>
            {secondFunction ? 'MC' : 'ln'}
          </button>
          <button className={numButton} onClick={() => handleNumberClick('4')}>
            4
          </button>
          <button className={numButton} onClick={() => handleNumberClick('5')}>
            5
          </button>
          <button className={numButton} onClick={() => handleNumberClick('6')}>
            6
          </button>
          <button className={opButton} onClick={() => handleOperatorClick('-')}>
            -
          </button>
          
          {/* Row 6 */}
          <button className={funcButton} onClick={secondFunction ? handleMemoryRecall : handleMemoryStore}>
            {secondFunction ? 'MR' : 'STO'}
          </button>
          <button className={numButton} onClick={() => handleNumberClick('1')}>
            1
          </button>
          <button className={numButton} onClick={() => handleNumberClick('2')}>
            2
          </button>
          <button className={numButton} onClick={() => handleNumberClick('3')}>
            3
          </button>
          <button className={opButton} onClick={() => handleOperatorClick('+')}>
            +
          </button>
          
          {/* Row 7 */}
          <button className={funcButton} onClick={secondFunction ? handleMemoryAdd : handleToggleSign}>
            {secondFunction ? 'M+' : '+/-'}
          </button>
          <button className={funcButton} onClick={handlePercent}>
            %
          </button>
          <button className={numButton} onClick={() => handleNumberClick('0')}>
            0
          </button>
          <button className={numButton} onClick={handleDecimalClick}>
            .
          </button>
          <button className={`${specialButton} bg-blue-800`} onClick={handleEquals}>
            =
          </button>
        </div>
        
        {/* History panel (collapsed by default) */}
        {history.length > 0 && (
          <div className="mt-4 pt-2 border-t border-gray-800 text-xs text-gray-400">
            <div className="max-h-20 overflow-y-auto">
              {history.map((item, index) => (
                <div key={index} className="py-1">{item}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TI36XPro;