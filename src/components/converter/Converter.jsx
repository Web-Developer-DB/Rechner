import React from 'react';

const Converter = ({ converter }) => {
  const {
    state: { category, fromUnit, toUnit, inputValue, rate, result, availableUnits },
    actions,
  } = converter;

  const unitOptions = availableUnits.map((unit) => (
    <option key={unit} value={unit}>
      {unit}
    </option>
  ));

  const isCurrency = category === 'currency';

  return (
    <div>
      <div className="conv-grid" style={{ marginTop: '10px' }}>
        <select value={category} onChange={(event) => actions.setCategory(event.target.value)}>
          <option value="length">Länge</option>
          <option value="mass">Gewicht</option>
          <option value="currency">Währung</option>
        </select>
        <span />
        <input
          type="number"
          step="any"
          placeholder="Wert eingeben"
          value={inputValue}
          onChange={(event) => actions.setInputValue(event.target.value)}
        />
        <div />
        <select value={fromUnit} onChange={(event) => actions.setFromUnit(event.target.value)}>
          {unitOptions}
        </select>
        <select value={toUnit} onChange={(event) => actions.setToUnit(event.target.value)}>
          {unitOptions}
        </select>
        <input type="text" readOnly value={result} />
        <div />
      </div>
      <div className="note">
        {isCurrency
          ? 'Währung: Kurs manuell anpassbar. Optional Live-Kurs laden, wenn online.'
          : 'Einheiten lassen sich direkt umrechnen.'}
      </div>
      {isCurrency ? (
        <div className="converter-note-row">
          <label className="note" htmlFor="convRateInput">
            Kurs (1 FROM ={' '}
            <input
              id="convRateInput"
              type="number"
              step="any"
              value={rate}
              onChange={(event) => actions.setRate(event.target.value)}
            />{' '}
            TO)
          </label>
          <button className="btn" type="button" onClick={actions.fetchLiveRate}>
            Live-Kurs laden
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Converter;
