import React from 'react';

const formatTimestamp = (timestamp) =>
  new Date(timestamp).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });

const HistoryPanel = ({
  entries,
  onSelectEntry,
  onClearHistory,
  showConverter,
  onToggleConverter,
  converter,
}) => (
  <div className="section">
    <h3>Verlauf & Konverter</h3>
    <div className="pad">
      <div className="log-controls">
        <button className="btn" type="button" onClick={onClearHistory}>
          Verlauf löschen
        </button>
        <button className="btn" type="button" onClick={onToggleConverter}>
          {showConverter ? 'Konverter ausblenden' : 'Konverter anzeigen'}
        </button>
      </div>
      <div className="log-list">
        {entries.length === 0 ? (
          <div className="note">Noch keine Einträge vorhanden.</div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="log-item"
              onClick={() => onSelectEntry(entry.result)}
            >
              <div>
                <div className="expr">{entry.expression}</div>
                <div className="time note">{formatTimestamp(entry.timestamp)}</div>
              </div>
              <div className="res">{String(entry.result)}</div>
            </button>
          ))
        )}
      </div>
      <div className={`adv ${showConverter ? 'show' : ''}`}>{converter}</div>
    </div>
  </div>
);

export default HistoryPanel;
