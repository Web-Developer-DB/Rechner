import React, { useEffect, useMemo } from 'react';

const operatorSymbols = {
  '/': '÷',
  '*': '×',
  '-': '−',
  '+': '+',
};

const Calculator = ({
  calculator,
  showAdvanced,
  onToggleAdvanced,
  onToggleTheme,
  theme,
  installAvailable,
  onInstall,
}) => {
  const {
    state: { currentDisplay, history, angleMode },
    actions,
    advancedActions,
    memoryActions,
    toggleAngleMode,
  } = calculator;

  const keypadLayout = useMemo(
    () => [
      { label: 'AC', className: 'danger', onClick: actions.clearAll },
      { label: 'DEL', className: 'op', onClick: actions.deleteLast },
      { label: '(', className: 'op', onClick: () => actions.appendValue('(') },
      { label: ')', className: 'op', onClick: () => actions.appendValue(')') },
      { label: '%', className: 'op', onClick: actions.applyPercent },
      { label: '±', className: 'op', onClick: actions.toggleSign },
      { label: 'x²', className: 'op', onClick: actions.square },
      { label: '√', className: 'op', onClick: actions.sqrt },
      { label: '7', onClick: () => actions.appendValue('7') },
      { label: '8', onClick: () => actions.appendValue('8') },
      { label: '9', onClick: () => actions.appendValue('9') },
      { label: operatorSymbols['/'], className: 'op', onClick: () => actions.pushOperator('/') },
      { label: '4', onClick: () => actions.appendValue('4') },
      { label: '5', onClick: () => actions.appendValue('5') },
      { label: '6', onClick: () => actions.appendValue('6') },
      { label: operatorSymbols['*'], className: 'op', onClick: () => actions.pushOperator('*') },
      { label: '1', onClick: () => actions.appendValue('1') },
      { label: '2', onClick: () => actions.appendValue('2') },
      { label: '3', onClick: () => actions.appendValue('3') },
      { label: operatorSymbols['-'], className: 'op', onClick: () => actions.pushOperator('-') },
      { label: '0', className: 'span-2', onClick: () => actions.appendValue('0') },
      { label: ',', onClick: () => actions.appendValue('.') },
      { label: operatorSymbols['+'], className: 'op', onClick: () => actions.pushOperator('+') },
      { label: '=', className: 'accent span-2', onClick: actions.evaluate },
      { label: 'Kopieren', className: 'op', onClick: actions.copyResult },
      { label: 'CE', className: 'op', onClick: actions.clearEntry },
    ],
    [actions],
  );

  const advancedLayout = useMemo(
    () => [
      { label: 'π', onClick: () => actions.setConstant(Math.PI) },
      { label: 'e', onClick: () => actions.setConstant(Math.E) },
      { label: 'ANS', onClick: actions.loadAnswer },
      { label: '1/x', onClick: actions.reciprocal },
      { label: 'x^y', onClick: () => actions.pushOperator('^') },
      { label: 'n!', onClick: advancedActions.factorial },
      { label: 'exp', onClick: advancedActions.exp },
      { label: 'log₁₀', onClick: advancedActions.log10 },
      { label: 'ln', onClick: advancedActions.naturalLog },
      { label: 'sin', onClick: advancedActions.sin },
      { label: 'cos', onClick: advancedActions.cos },
      { label: 'tan', onClick: advancedActions.tan },
      { label: 'MC', onClick: memoryActions.memoryClear },
      { label: 'MR', onClick: memoryActions.memoryRecall },
      { label: 'M+', onClick: memoryActions.memoryAdd },
      { label: 'M-', onClick: memoryActions.memorySubtract },
    ],
    [actions, advancedActions, memoryActions],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        actions.evaluate();
        return;
      }
      if (/^[0-9]$/.test(event.key)) {
        actions.appendValue(event.key);
        return;
      }
      if (event.key === '.' || event.key === ',') {
        actions.appendValue('.');
        return;
      }
      if (['+', '-', '*', '/', '^'].includes(event.key)) {
        actions.pushOperator(event.key);
        return;
      }
      if (event.key === 'Backspace') {
        actions.deleteLast();
        return;
      }
      if (event.key === 'Delete') {
        actions.clearEntry();
        return;
      }
      if (event.key === 'Escape') {
        actions.clearAll();
        return;
      }
      if (event.key === '(' || event.key === ')') {
        actions.appendValue(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className="card">
      <div className="topbar">
        <div className="brand">
          <span className="dot" />
          Rechner
        </div>
        <div className="row">
          <button className="btn" type="button" onClick={toggleAngleMode} aria-label="Winkelmaß">
            {angleMode === 'deg' ? 'Grad' : 'Bogenmaß'}
          </button>
          <button
            className="btn"
            type="button"
            onClick={onToggleAdvanced}
            aria-expanded={showAdvanced}
          >
            Erw. Funktionen
          </button>
          {installAvailable ? (
            <button className="btn" type="button" onClick={onInstall}>
              Installieren
            </button>
          ) : null}
          <button
            className="btn"
            type="button"
            onClick={onToggleTheme}
            aria-label="Darstellung umschalten"
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="display" role="region" aria-live="polite">
        <div className="history-inline">{history}</div>
        <div className="current">{currentDisplay || '0'}</div>
      </div>

      <div className="grid" role="group" aria-label="Tasten">
        {keypadLayout.map(({ label, className, onClick }) => (
          <button
            key={label}
            type="button"
            className={`key ${className ?? ''}`.trim()}
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={`adv ${showAdvanced ? 'show' : ''}`} role="group" aria-label="Erweiterte Tasten">
        <div className="grid-adv">
          {advancedLayout.map(({ label, onClick }) => (
            <button key={label} type="button" className="key op" onClick={onClick}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="footer">
        Tastatur: Ziffern, + − × ÷, Punkt, Enter, Backspace, Esc. • PWA: über „Installieren“
        hinzufügen, offline-fähig.
      </div>
    </div>
  );
};

export default Calculator;
