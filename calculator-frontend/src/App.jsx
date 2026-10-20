import { useState } from 'react'

const keys = [
  { label: '7' }, { label: '8' }, { label: '9' }, { label: '÷', value: '/' },
  { label: '4' }, { label: '5' }, { label: '6' }, { label: '×', value: '*' },
  { label: '1' }, { label: '2' }, { label: '3' }, { label: '−', value: '-' },
  { label: 'AC', kind: 'clear' }, { label: '0' }, { label: '.', kind: 'decimal' }, { label: '+', value: '+' },
  { label: '=', kind: 'equals' },
];

const operators = ['+', '-', '*', '/'];

function displayExpression(expression) {
  return expression.replaceAll('*', '×').replaceAll('/', '÷').replaceAll('-', '−');
}

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  function enter(key) {
    setError('');
    if (key.kind === 'clear') {
      setExpression('');
      setResult('');
      setHasCalculated(false);
      return;
    }
    if (key.kind === 'equals') {
      calculate();
      return;
    }

    const value = key.value ?? key.label;
    setExpression((current) => {
      if (operators.includes(value)) {
        const start = hasCalculated ? String(result) : current;
        if (!start && value !== '-') return start;
        if (/[+\-*/]$/.test(start)) return `${start.slice(0, -1)}${value}`;
        return `${start}${value}`;
      }
      return hasCalculated ? value : `${current}${value}`;
    });
    setResult('');
    setHasCalculated(false);
  }

  async function calculate() {
    if (!expression) return;
    setError('');
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({expression}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Calculation failed.');
      setResult(String(Number.parseFloat(data.result.toPrecision(12))));
      setHasCalculated(true);
    } catch (error) { 
      setError(error.message || 'Could not reach calc server');
    }
  }
  return (
    <main className='page'>
      <section className='calculator'>
        <div className='heading'>Mini Calculator</div>
        <div className='calculator-content'>
          <div className='displayExp'>
            <div className='Exp'>{expression ? displayExpression(expression): '0'}</div>
            <div className={`result ${error ? 'error': ''}`}>{error || (result ? `= ${result}`: '')}</div>
          </div>
          <div className='pad'>
              {keys.map((key) => (
                <button
                  className={`key ${key.value ? 'operator': ''} ${key.kind ?? ''}`}
                  key={key.label}
                  onClick={() => enter(key)}
                  aria-label={key.label === 'AC' ? 'Clear': key.label}
                >
                  {key.label}
                </button>
              ))}
          </div>
        </div>
      </section>
      
    </main>
    
  )
}

export default App
