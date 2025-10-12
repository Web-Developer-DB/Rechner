const DEFAULT_PRECISION = 12;

export const clampPrecision = (value, precision = DEFAULT_PRECISION) => {
  const numeric = typeof value === 'number' ? value : parseFloat(value);
  if (!Number.isFinite(numeric)) {
    return numeric;
  }

  const trimmed = parseFloat(numeric.toFixed(precision));
  return trimmed;
};

export const formatNumberForStorage = (value, precision = DEFAULT_PRECISION) => {
  const numeric = clampPrecision(value, precision);
  if (!Number.isFinite(numeric)) {
    return 'NaN';
  }

  return String(numeric);
};

export const formatNumberForDisplay = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  return stringValue.replace(/\./g, ',');
};

export const parseDisplayNumber = (value) => {
  if (value === null || value === undefined) {
    return NaN;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value === '' || value === '-') {
    return NaN;
  }

  const normalized = value.replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};
