import { useCallback, useMemo, useState } from 'react';
import { clampPrecision } from '../utils/number.js';

const UNIT_MAP = {
  length: {
    base: 'm',
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      ft: 0.3048,
      in: 0.0254,
    },
  },
  mass: {
    base: 'kg',
    units: {
      kg: 1,
      g: 0.001,
      t: 1000,
      lb: 0.45359237,
      oz: 0.028349523125,
    },
  },
};

const CURRENCIES = ['EUR', 'USD', 'GBP', 'TRY', 'CHF'];

const DEFAULT_UNITS = {
  length: ['m', 'km'],
  mass: ['kg', 'g'],
  currency: ['EUR', 'USD'],
};

const deriveDefaultUnits = (category) => {
  const defaults = DEFAULT_UNITS[category];
  if (defaults) {
    return defaults;
  }
  return ['m', 'km'];
};

export const useConverter = ({ onFeedback } = {}) => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('');
  const [rate, setRate] = useState(1);

  const emitFeedback = useCallback(
    (kind) => {
      if (typeof onFeedback === 'function') {
        onFeedback(kind);
      }
    },
    [onFeedback],
  );

  const availableUnits = useMemo(() => {
    if (category === 'currency') {
      return CURRENCIES;
    }
    const entry = UNIT_MAP[category];
    if (entry && entry.units) {
      return Object.keys(entry.units);
    }
    return Object.keys(UNIT_MAP.length.units);
  }, [category]);

  const updateCategory = useCallback(
    (nextCategory) => {
      setCategory(nextCategory);
      const [defaultFrom, defaultTo] = deriveDefaultUnits(nextCategory);
      setFromUnit(defaultFrom);
      setToUnit(defaultTo);
      setRate(1);
      emitFeedback('tap');
    },
    [emitFeedback],
  );

  const updateFromUnit = useCallback(
    (unit) => {
      setFromUnit(unit);
      emitFeedback('tap');
    },
    [emitFeedback],
  );

  const updateToUnit = useCallback(
    (unit) => {
      setToUnit(unit);
      emitFeedback('tap');
    },
    [emitFeedback],
  );

  const updateRate = useCallback(
    (value) => {
      const numericValue = Number(value);
      setRate(Number.isFinite(numericValue) ? numericValue : 0);
      emitFeedback('tap');
    },
    [emitFeedback],
  );

  const updateInputValue = useCallback(
    (value) => {
      setInputValue(value);
      emitFeedback('tap');
    },
    [emitFeedback],
  );

  const swapUnits = useCallback(() => {
    setFromUnit((prevFrom) => {
      setToUnit(prevFrom);
      return toUnit;
    });
    emitFeedback('tap');
  }, [emitFeedback, toUnit]);

  const conversionResult = useMemo(() => {
    const value = parseFloat(inputValue);
    if (!Number.isFinite(value)) {
      return '';
    }

    if (category === 'currency') {
      if (fromUnit === toUnit) {
        return String(clampPrecision(value, 6));
      }
      return String(clampPrecision(value * rate, 6));
    }

    const unitEntry = UNIT_MAP[category];
    if (!unitEntry) {
      return '';
    }
    const factorFrom = unitEntry.units[fromUnit];
    const factorTo = unitEntry.units[toUnit];
    if (!factorFrom || !factorTo) {
      return '';
    }
    const baseValue = value * factorFrom;
    const result = baseValue / factorTo;
    return String(clampPrecision(result, 6));
  }, [category, fromUnit, inputValue, rate, toUnit]);

  const fetchLiveRate = useCallback(async () => {
    if (category !== 'currency') {
      return;
    }
    emitFeedback('tap');
    if (fromUnit === toUnit) {
      return;
    }
    try {
      const response = await fetch(
        `https://api.exchangerate.host/latest?base=${fromUnit}&symbols=${toUnit}`,
      );
      const data = await response.json();
      const nextRate = data?.rates?.[toUnit];
      if (Number.isFinite(nextRate)) {
        setRate(nextRate);
        emitFeedback('ok');
      }
    } catch {
      emitFeedback('err');
    }
  }, [category, emitFeedback, fromUnit, toUnit]);

  return {
    state: {
      category,
      fromUnit,
      toUnit,
      inputValue,
      rate,
      availableUnits,
      result: conversionResult,
    },
    actions: {
      setCategory: updateCategory,
      setFromUnit: updateFromUnit,
      setToUnit: updateToUnit,
      setRate: updateRate,
      setInputValue: updateInputValue,
      swapUnits,
      fetchLiveRate,
    },
  };
};
