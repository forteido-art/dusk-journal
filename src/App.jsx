import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

function App() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const fileInputRef = useRef(null);

  // Load from localStorage + setup SW update listener
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('dusk-entries')) || [];
    setEntries(savedEntries);

    const savedDark = JSON.parse(localStorage.getItem('dusk-darkMode')) || false;
    setDarkMode(savedDark);
    if (savedDark) document.documentElement.classList.add('dark');

    const savedReminder = localStorage.getItem('dusk-reminderTime') || '';
    setReminderTime(savedReminder);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              setWaitingWorker(newWorker);
            }
          });
        });
      });
    }
  }, []);

  // Save entries
  useEffect(() => {
    localStorage.setItem('dusk-entries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    if (!text.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toLocaleString()
    };
    setEntries([newEntry,...entries]);
    setText('');
  };

  const toggleDarkMode = () => {
    const newMode =!darkMode;
    setDarkMode(newMode);
    localStorage.setItem('dusk-darkMode', JSON.stringify(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setShowSettings(false);
  };

  const handleSetReminder = () => {
    const time = prompt('Set daily reminder time (HH:MM):', reminderTime || '20:00');
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setReminderTime(time);
      localStorage.setItem('dusk-reminderTime', time);
      if ('Notification' in window && Notification.permission!== 'granted') {
        Notification.requestPermission();
      }
    }
    setShowSettings(false);
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dusk-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowSettings(false);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setEntries(imported);
          alert('Backup imported successfully');
        } else {
          alert('Invalid backup file');
        }
      } catch {
        alert('Error reading backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowSettings(false);
  };

  const handleExportPDF = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text('Dusk Journal Export', 14, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, y);
    y += 15;

    entries.forEach((entry) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(entry.date, 14, y);
      y += 7;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(entry.text, 180);
      doc.text(splitText, 14, y);
      y += splitText.length * 5 + 10;
    });

    doc.save(`dusk-journal-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowSettings(false);
  };

  const handleLockApp = () => {
    setShowSettings(false);
    window.location.reload();
  };

  const handleUpdateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDeleteEntry = (id) => {
    if (confirm('Delete this entry?')) {
      setEntries(entries.filter(e => e.id!== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-2xl mx-auto p-4">

        {updateAvailable && (
          <div className="mb-4 bg-green-500 text-white px-4 py-3 rounded-lg flex justify-between items-center">
            <span>🔄 Update Available</span>
            <button
              onClick={handleUpdateApp}
              className="bg-white text-green-600 px-3 py-1 rounded font-medium"
            >
              Reload
            </button>
          </div>
        )}

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dusk</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80"
          >
            ⚙️ Settings
          </button>
        </header>

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
          />
          <button
            onClick={handleAddEntry}
            className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Entry
          </button>
        </div>

        <div className="space-y-4">
          {entries.length === 0? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No entries yet. Write your first thought above.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))
          )}
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-2xl leading-none">×</button>
              </div>

              <button
                onClick={toggleDarkMode}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:opacity-80"
              >
                {darkMode? '☀️ Light Mode' : '🌙 Night Mode'}
              </button>

              <button
                onClick={handleSetReminder}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:opacity-80"
              >
                ⏰ Daily Reminder {reminderTime && `at ${reminderTime}`}
              </button>

              <button
                onClick={handleExportPDF}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:opacity-80"
              >
                📄 Export to PDF
              </button>

              <button
                onClick={handleExportBackup}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:opacity-80"
              >
                💾 Download Backup
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:opacity-80"
              >
                📤 Import Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />

              <button
                onClick={handleLockApp}
                className="w-full text-left px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:opacity-80"
              >
                🔒 Lock App
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
