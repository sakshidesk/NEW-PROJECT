import React, { useState } from 'react';
import CalculatorButton from './components/CalculatorButton';

const App: React.FC = () => {
    const [displayValue, setDisplayValue] = useState<string>('0');
    const [expression, setExpression] = useState<string>('');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);

    const formatNumber = (numStr: string): string => {
        if (!numStr || numStr.includes('Error') || numStr.includes('Infinity')) return 'Error';
        const [integerPart, decimalPart] = numStr.split('.');
        // Avoid formatting if it's just a trailing decimal or empty
        if (integerPart === '' && decimalPart !== undefined) return `0.${decimalPart}`;
        if (isNaN(parseFloat(integerPart))) return '0';
        
        const formattedInteger = parseFloat(integerPart).toLocaleString('en-US', {maximumFractionDigits: 20});
        return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    };

    const clearAll = () => {
        setDisplayValue('0');
        setExpression('');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    };

    const inputDigit = (digit: string) => {
        if (displayValue.includes('Error')) {
            clearAll();
            setDisplayValue(digit);
            setWaitingForOperand(false);
            return;
        }

        if (waitingForOperand) {
            // After hitting '=', a new number starts a new calculation
            if (operator === null) {
                clearAll();
            }
            setDisplayValue(digit);
            setWaitingForOperand(false);
        } else {
            if (displayValue.length > 15) return;
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };
    
    const inputDecimal = () => {
        if (displayValue.includes('Error')) return;
        if (waitingForOperand) {
             setDisplayValue('0.');
             setWaitingForOperand(false);
             return;
        }
        if (!displayValue.includes('.')) {
            setDisplayValue(displayValue + '.');
        }
    };

    const toggleSign = () => {
        if (displayValue.includes('Error') || displayValue === '0') return;
        setDisplayValue(prev => (parseFloat(prev) * -1).toString());
    };

    const inputPercent = () => {
        if (displayValue.includes('Error')) return;
        const currentValue = parseFloat(displayValue);
        setDisplayValue((currentValue / 100).toString());
        setWaitingForOperand(true);
    };
    
    const calculate = (val1: number, val2: number, op: string): number => {
        switch (op) {
            case '+': return val1 + val2;
            case '−': return val1 - val2;
            case '×': return val1 * val2;
            case '÷': return val1 / val2; // Infinity/NaN is handled by formatNumber
            default: return val2;
        }
    }

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(displayValue);
    
        if (isNaN(inputValue)) return;
    
        if (operator && waitingForOperand) {
          setOperator(nextOperator);
          setExpression(prev => prev.slice(0, -2) + ` ${nextOperator} `);
          return;
        }
    
        const newExpression = expression.includes('=') ? `${formatNumber(displayValue)} ${nextOperator} `
            : (expression === '' ? `${formatNumber(displayValue)} ${nextOperator} ` : `${expression} ${formatNumber(displayValue)} ${nextOperator === '=' ? '=' : `${nextOperator} `}`);
        setExpression(newExpression.replace(` ${operator}  =`, ' ='));


        if (prevValue === null) {
          setPrevValue(inputValue);
        } else if (operator) {
          const result = calculate(prevValue, inputValue, operator);
          setPrevValue(result);
          setDisplayValue(String(result));
        }
    
        setWaitingForOperand(true);
        setOperator(nextOperator === '=' ? null : nextOperator);
    };

    const buttons = [
        { label: 'AC', handler: clearAll, className: 'text-gray-500' },
        { label: '+/-', handler: toggleSign, className: 'text-gray-500' },
        { label: '%', handler: inputPercent, className: 'text-gray-500' },
        { label: '÷', handler: () => performOperation('÷'), className: 'text-blue-500 text-4xl' },
        { label: '7', handler: () => inputDigit('7'), className: 'text-gray-800' },
        { label: '8', handler: () => inputDigit('8'), className: 'text-gray-800' },
        { label: '9', handler: () => inputDigit('9'), className: 'text-gray-800' },
        { label: '×', handler: () => performOperation('×'), className: 'text-blue-500 text-4xl' },
        { label: '4', handler: () => inputDigit('4'), className: 'text-gray-800' },
        { label: '5', handler: () => inputDigit('5'), className: 'text-gray-800' },
        { label: '6', handler: () => inputDigit('6'), className: 'text-gray-800' },
        { label: '−', handler: () => performOperation('−'), className: 'text-blue-500 text-4xl' },
        { label: '1', handler: () => inputDigit('1'), className: 'text-gray-800' },
        { label: '2', handler: () => inputDigit('2'), className: 'text-gray-800' },
        { label: '3', handler: () => inputDigit('3'), className: 'text-gray-800' },
        { label: '+', handler: () => performOperation('+'), className: 'text-blue-500 text-4xl' },
        // Fix: Use 'as const' to ensure TypeScript infers a literal type for 'justify', preventing a type mismatch error.
        { label: '0', handler: () => inputDigit('0'), className: 'text-gray-800', gridSpan: 2, justify: 'start' as const },
        { label: '.', handler: inputDecimal, className: 'text-gray-800' },
        { label: '=', handler: () => performOperation('='), className: 'text-blue-500 text-4xl' },
    ];
    
    const displayFontSize = displayValue.length > 9 ? 'text-5xl' : 'text-6xl';

    return (
        <div className="bg-gradient-to-br from-gray-100 to-blue-200 min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-xs mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-b from-cyan-400 to-blue-600 text-white p-6 text-right min-h-[160px] flex flex-col justify-end">
                    <p className="text-xl opacity-75 h-8 break-words text-right" style={{direction: 'ltr'}}>{expression || ' '}</p>
                    <p className={`font-light tracking-tight break-all ${displayFontSize}`}>{formatNumber(displayValue)}</p>
                </div>
                <div className="grid grid-cols-4 bg-white">
                    {buttons.map((btn, i) => (
                        <CalculatorButton
                            key={i}
                            onClick={btn.handler}
                            label={btn.label}
                            className={btn.className}
                            gridSpan={btn.gridSpan}
                            justify={btn.justify}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;