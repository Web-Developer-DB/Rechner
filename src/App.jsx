import React, { useCallback, useState } from 'react';
import Calculator from './components/calculator/Calculator.jsx';
import HistoryPanel from './components/history/HistoryPanel.jsx';
import Converter from './components/converter/Converter.jsx';
import { useTheme } from './hooks/useTheme.js';
import { useCalculator } from './hooks/useCalculator.js';
import { useHistoryLog } from './hooks/useHistoryLog.js';
import { useConverter } from './hooks/useConverter.js';
import { usePwaSetup } from './pwa/usePwaSetup.js';
import { triggerHaptic } from './utils/haptics.js';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConverter, setShowConverter] = useState(false);

  const historyLog = useHistoryLog();

  const handleFeedback = useCallback((kind) => {
    triggerHaptic(kind);
  }, []);

  const calculator = useCalculator({
    onEvaluate: historyLog.addEntry,
    onFeedback: handleFeedback,
  });

  const converter = useConverter({ onFeedback: handleFeedback });

  const { installAvailable, requestInstall } = usePwaSetup();

  const handleHistorySelect = useCallback(
    (value) => {
      calculator.setFromHistory(value);
    },
    [calculator],
  );

  const handleToggleAdvanced = useCallback(() => {
    triggerHaptic('tap');
    setShowAdvanced((prev) => !prev);
  }, []);

  const handleToggleConverter = useCallback(() => {
    triggerHaptic('tap');
    setShowConverter((prev) => !prev);
  }, []);

  const handleToggleTheme = useCallback(() => {
    triggerHaptic('tap');
    toggleTheme();
  }, [toggleTheme]);

  const handleInstall = useCallback(async () => {
    triggerHaptic('tap');
    const result = await requestInstall();
    if (result) {
      triggerHaptic('ok');
    }
  }, [requestInstall]);

  return (
    <div className="app">
      <div className="layout">
        <Calculator
          calculator={calculator}
          showAdvanced={showAdvanced}
          onToggleAdvanced={handleToggleAdvanced}
          onToggleTheme={handleToggleTheme}
          theme={theme}
          installAvailable={installAvailable}
          onInstall={handleInstall}
        />
        <HistoryPanel
          entries={historyLog.entries}
          onSelectEntry={handleHistorySelect}
          onClearHistory={historyLog.clearEntries}
          showConverter={showConverter}
          onToggleConverter={handleToggleConverter}
          converter={<Converter converter={converter} />}
        />
      </div>
    </div>
  );
};

export default App;
