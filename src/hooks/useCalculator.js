import { useCallback, useMemo, useState } from 'react';
import { evaluateExpression } from '../utils/math.js';
import {
  formatNumberForDisplay,
  formatNumberForStorage,
  parseDisplayNumber,
} from '../utils/number.js';

const ANGLE_STORAGE_KEY = 'calc-angle';

const getInitialAngleMode = () => {
  if (typeof window === 'undefined') {
    return 'deg';
  }

  try {
    const stored = window.localStorage.getItem(ANGLE_STORAGE_KEY);
    if (stored === 'deg' || stored === 'rad') {
      return stored;
    }
  } catch {
    // ignore
  }

  return 'deg';
};

const isFiniteNumber = (value) => Number.isFinite(value) && !Number.isNaN(value);

const trigArgument = (value, angleMode) => {
  if (angleMode === 'deg') {
    return (value * Math.PI) / 180;
  }
  return value;
};

const FACTORIAL_LIMIT = 170;

export const useCalculator = ({ onEvaluate, onFeedback } = {}) => {
  const [current, setCurrent] = useState('0');
  const [history, setHistory] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState(getInitialAngleMode);

  const emitFeedback = useCallback(
    (kind) => {
      if (typeof onFeedback === 'function') {
        onFeedback(kind);
      }
    },
    [onFeedback],
  );

  const appendValue = useCallback(
    (value) => {
      emitFeedback('tap');
      setCurrent((prev) => {
        if (value === '.' && prev.includes('.')) {
          return prev;
        }
        if (prev === '0' && value !== '.' && value !== ')') {
          return value;
        }
        return prev + value;
      });
    },
    [emitFeedback],
  );

  const clearAll = useCallback(() => {
    emitFeedback('tap');
    setCurrent('0');
    setHistory('');
    setLastResult(null);
  }, [emitFeedback]);

  const clearEntry = useCallback(() => {
    emitFeedback('tap');
    setCurrent('0');
  }, [emitFeedback]);

  const deleteLast = useCallback(() => {
    emitFeedback('tap');
    setCurrent((prev) => {
      if (prev.length <= 1) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [emitFeedback]);

  const toggleSign = useCallback(() => {
    emitFeedback('tap');
    setCurrent((prev) => {
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      if (prev === '0') {
        return prev;
      }
      return `-${prev}`;
    });
  }, [emitFeedback]);

  const applyPercent = useCallback(() => {
    const value = parseDisplayNumber(current);
    if (!isFiniteNumber(value)) {
      return;
    }
    const computed = lastResult !== null ? (lastResult * value) / 100 : value / 100;
    setCurrent(formatNumberForStorage(computed));
    emitFeedback('tap');
  }, [current, emitFeedback, lastResult]);

  const square = useCallback(() => {
    const value = parseDisplayNumber(current);
    if (!isFiniteNumber(value)) {
      return;
    }
    setCurrent(formatNumberForStorage(value * value));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const sqrt = useCallback(() => {
    const value = parseDisplayNumber(current);
    if (value < 0) {
      setCurrent('NaN');
      emitFeedback('err');
      return;
    }
    setCurrent(formatNumberForStorage(Math.sqrt(value)));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const reciprocal = useCallback(() => {
    const value = parseDisplayNumber(current);
    if (!isFiniteNumber(value) || value === 0) {
      setCurrent('NaN');
      emitFeedback('err');
      return;
    }
    setCurrent(formatNumberForStorage(1 / value));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const factorial = useCallback(() => {
    const value = parseDisplayNumber(current);
    if (!Number.isInteger(value) || value < 0 || value > FACTORIAL_LIMIT) {
      setCurrent('NaN');
      emitFeedback('err');
      return;
    }
    let result = 1;
    for (let i = 2; i <= value; i += 1) {
      result *= i;
    }
    setCurrent(formatNumberForStorage(result));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const naturalLog = useCallback(() => {
    const value = parseDisplayNumber(current);
    setCurrent(formatNumberForStorage(Math.log(value)));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const log10 = useCallback(() => {
    const value = parseDisplayNumber(current);
    setCurrent(formatNumberForStorage(Math.log10(value)));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const exp = useCallback(() => {
    const value = parseDisplayNumber(current);
    setCurrent(formatNumberForStorage(Math.exp(value)));
    emitFeedback('tap');
  }, [current, emitFeedback]);

  const applyTrig = useCallback(
    (fn) => {
      const value = parseDisplayNumber(current);
      if (!isFiniteNumber(value)) {
        return;
      }
      const arg = trigArgument(value, angleMode);
      setCurrent(formatNumberForStorage(fn(arg)));
      emitFeedback('tap');
    },
    [angleMode, current, emitFeedback],
  );

  const setConstant = useCallback(
    (value) => {
      emitFeedback('tap');
      setCurrent(formatNumberForStorage(value));
    },
    [emitFeedback],
  );

  const copyResult = useCallback(() => {
    emitFeedback('tap');
    if (!navigator?.clipboard) {
      return;
    }
    const valueToCopy = formatNumberForDisplay(current);
    navigator.clipboard
      .writeText(valueToCopy)
      .then(() => {
        const previousHistory = history;
        setHistory('Kopiert ✓');
        const resetHistory = () => {
          setHistory((currentHistory) =>
            currentHistory === 'Kopiert ✓' ? previousHistory : currentHistory,
          );
        };
        if (typeof window !== 'undefined') {
          window.setTimeout(resetHistory, 800);
        } else {
          resetHistory();
        }
      })
      .catch(() => {
        // ignore clipboard errors
      });
  }, [current, emitFeedback, history]);

  const pushOperator = useCallback(
    (operator) => {
      emitFeedback('tap');
      setHistory((prevHistory) => {
        const operatorPattern = /[+\-*/^]$/;
        const trimmedPrev = prevHistory.trimEnd();
        if (current === '0' && operatorPattern.test(trimmedPrev)) {
          return `${trimmedPrev.slice(0, -1)}${operator} `;
        }

        const combined = `${prevHistory}${current}`;
        const trimmedCombined = combined.trimEnd();
        if (operatorPattern.test(trimmedCombined)) {
          return `${trimmedCombined.replace(operatorPattern, operator)} `;
        }
        return `${combined} ${operator} `;
      });
      setCurrent('0');
    },
    [current, emitFeedback],
  );

  const evaluate = useCallback(() => {
    const expression = `${history}${current}`;

    try {
      const { tokens, rpn, result } = evaluateExpression(expression);
      if (tokens.length === 0) {
        return;
      }
      if (!isFiniteNumber(result)) {
        setCurrent('NaN');
        emitFeedback('err');
        return;
      }
      const formatted = formatNumberForStorage(result);
      setCurrent(formatted);
      setHistory('');
      setLastResult(result);
      emitFeedback('ok');
      if (typeof onEvaluate === 'function') {
        onEvaluate(expression.trim(), result, { tokens, rpn });
      }
    } catch (error) {
      setCurrent('Fehler');
      emitFeedback('err');
    }
  }, [current, emitFeedback, history, onEvaluate]);

  const loadAnswer = useCallback(() => {
    if (lastResult === null) {
      return;
    }
    emitFeedback('tap');
    setCurrent(formatNumberForStorage(lastResult));
  }, [emitFeedback, lastResult]);

  const memoryClear = useCallback(() => {
    emitFeedback('tap');
    setMemory(0);
  }, [emitFeedback]);

  const memoryRecall = useCallback(() => {
    emitFeedback('tap');
    setCurrent(formatNumberForStorage(memory));
  }, [emitFeedback, memory]);

  const memoryAdd = useCallback(() => {
    emitFeedback('tap');
    setMemory((prev) => prev + (parseDisplayNumber(current) || 0));
  }, [current, emitFeedback]);

  const memorySubtract = useCallback(() => {
    emitFeedback('tap');
    setMemory((prev) => prev - (parseDisplayNumber(current) || 0));
  }, [current, emitFeedback]);

  const setFromHistory = useCallback(
    (value) => {
      emitFeedback('tap');
      setHistory('');
      setCurrent(formatNumberForStorage(value));
      setLastResult(value);
    },
    [emitFeedback],
  );

  const toggleAngleMode = useCallback(() => {
    emitFeedback('tap');
    setAngleMode((prev) => {
      const next = prev === 'deg' ? 'rad' : 'deg';
      try {
        window.localStorage.setItem(ANGLE_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, [emitFeedback]);

  const state = useMemo(
    () => ({
      current,
      currentDisplay: formatNumberForDisplay(current),
      history,
      lastResult,
      memory,
      angleMode,
    }),
    [angleMode, current, history, lastResult, memory],
  );

  const basicActions = useMemo(
    () => ({
      appendValue,
      clearAll,
      clearEntry,
      deleteLast,
      toggleSign,
      applyPercent,
      square,
      sqrt,
      reciprocal,
      evaluate,
      pushOperator,
      copyResult,
      setConstant,
      loadAnswer,
    }),
    [
      appendValue,
      applyPercent,
      clearAll,
      clearEntry,
      copyResult,
      deleteLast,
      evaluate,
      loadAnswer,
      pushOperator,
      reciprocal,
      setConstant,
      square,
      sqrt,
      toggleSign,
    ],
  );

  const advancedActions = useMemo(
    () => ({
      factorial,
      exp,
      log10,
      naturalLog,
      sin: () => applyTrig(Math.sin),
      cos: () => applyTrig(Math.cos),
      tan: () => applyTrig(Math.tan),
    }),
    [applyTrig, exp, factorial, log10, naturalLog],
  );

  const memoryActions = useMemo(
    () => ({
      memoryClear,
      memoryRecall,
      memoryAdd,
      memorySubtract,
    }),
    [memoryAdd, memoryClear, memoryRecall, memorySubtract],
  );

  return {
    state,
    actions: basicActions,
    advancedActions,
    memoryActions,
    setFromHistory,
    toggleAngleMode,
  };
};
