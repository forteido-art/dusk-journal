import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { jsPDF } from 'jspdf';

const getStyles = (isDark) => ({
  container: {
    minHeight: '100vh',
    backgroundColor: isDark ? '#1a1a1a' : '#fdf2f8',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '40px 20px',
    color: isDark ? '#f5f5f0' : '#000',
    transition: 'background-color 0.3s, color 0.3s'
  },
  wrapper: {
    maxWidth: 700,
    margin: '0 auto',
    position: 'relative'
  },
  settingsBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '8px 16px',
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#f5f5f0' : '#be185d',
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    zIndex: 10
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
    paddingTop: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    color: isDark ? '#f5f5f0' : '#be185d'
  },
  subtitle: {
    fontSize: 14,
    color: isDark ? '#d4d4d0' : '#9d174d',
    marginTop: 8
  },
  tabs: {
    display: 'flex',
    gap: 12,
    marginBottom: 30,
    justifyContent: 'center'
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 8,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#f5f5f0' : '#000',
    cursor: 'pointer',
    fontSize: 14
  },
  tabActive: {
    backgroundColor: '#ec4899',
    color: '#fff',
    border: '1px solid #ec4899'
  },
  form: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    marginBottom: 30
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: `1px solid ${isDark ? '#404040' : '#f9a8d4'}`,
    borderRadius: 8,
    marginBottom: 12,
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#f5f5f0' : '#000'
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: `1px solid ${isDark ? '#404040' : '#f9a8d4'}`,
    borderRadius: 8,
    minHeight: 120,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#f5f5f0' : '#000',
    resize: 'vertical'
  },
  button: {
    marginTop: 12,
    marginRight: 8,
    padding: '10px 20px',
    backgroundColor: '#ec4899',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  buttonSecondary: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#f5f5f0' : '#be185d',
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`
  },
  entry: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    marginBottom: 16
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: isDark ? '#f5f5f0' : '#be185d',
    cursor: 'pointer'
  },
  entryContent: {
    fontSize: 14,
    color: isDark ? '#f5f5f0' : '#000',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap'
  },
  entryDate: {
    fontSize: 12,
    color: isDark ? '#a0a0a0' : '#6b7280',
    marginTop: 8
  },
  entryActions: {
    marginTop: 12,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  offlineBanner: {
    backgroundColor: isDark ? '#3a2a00' : '#fef3c7',
    color: isDark ? '#f5f5f0' : '#92400e',
    padding: '10px 16px',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    border: `1px solid ${isDark ? '#5a4a00' : '#fcd34a'}`
  },
  tag: {
    display: 'inline-block',
    backgroundColor: isDark ? '#404040' : '#fbcfe8',
    color: isDark ? '#f5f5f0' : '#9d174d',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginTop: 6
  },
  tagRemove: {
    marginLeft: 6,
    cursor: 'pointer',
    fontWeight: 700
  },
  lockScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1a1a1a' : '#fdf2f8'
  },
  lockBox: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 40,
    borderRadius: 16,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    textAlign: 'center',
    maxWidth: 400,
    width: '100%'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: 20
  },
  modalBox: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  modalButton: {
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    borderRadius: 8,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#f5f5f0' : '#000',
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 12
  },
  saveIndicator: {
    fontSize: 12,
    color: '#16a34a'
  },
  folder: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    borderRadius: 12,
    border: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`,
    marginBottom: 12,
    overflow: 'hidden'
  },
  folderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    backgroundColor: isDark ? '#333333' : '#fff5f9',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 16,
    color: isDark ? '#be185d' : '#be185d',
    borderBottom: isDark ? '1px solid #404040' : '1px solid #fbcfe8'
  },
  folderContent: {
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  clickableTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: isDark ? '#e0e0e0' : '#374151',
    cursor: 'pointer',
    padding: '4px 0',
    transition: 'color 0.2s',
  }
});

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('dusk-theme') === 'dark';
  });
  const styles = getStyles(isDark);

  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [view, setView] = useState('journal');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [customTags, setCustomTags] = useState(['Visions', 'Bible Study', 'Work', 'Family']);
  const [saveStatus, setSaveStatus] = useState('');
  const [saveTime, setSaveTime] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const [expandedFolders, setExpandedFolders] = useState({});

  const storedPin = localStorage.getItem('dusk-pin');

  // Unified Lock Function (Keeps data in memory)
  const handleLock = useCallback(() => {
    setIsLocked(true);
    setView('journal');
    setSelectedEntry(null);
    setShowSettings(false);
  }, []);

  // Auto-lock on exit, minimize, or screen sleep
  useEffect(() => {
    const handleAutoLock = () => {
      if (document.hidden || !document.hasFocus()) {
        handleLock();
      }
    };

    window.addEventListener('visibilitychange', handleAutoLock);
    window.addEventListener('blur', handleAutoLock);

    return () => {
      window.removeEventListener('visibilitychange', handleAutoLock);
      window.removeEventListener('blur', handleAutoLock);
    };
  }, [handleLock]);

  useEffect(() => {
    localStorage.setItem('dusk-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!isLocked) {
      try {
        const saved = localStorage.getItem('dusk-entries');
        if (saved) setEntries(JSON.parse(saved));
        const savedTags = localStorage.getItem('dusk-tags');
        if (savedTags) setCustomTags(JSON.parse(savedTags));
      } catch (e) {
        console.error('Failed to load entries:', e);
      }
    }
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) localStorage.setItem('dusk-entries', JSON.stringify(entries));
  }, [entries, isLocked]);

  useEffect(() => {
    if (!isLocked) localStorage.setItem('dusk-tags', JSON.stringify(customTags));
  }, [customTags, isLocked]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration);
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setSwUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showSettings) setShowSettings(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSettings]);

  const handleSave = useCallback((isAutoSave = false) => {
    if (!title.trim() && !content.trim()) return;

    setEntries(prev => {
      const now = new Date().toISOString();

      if (editingId) {
        return prev.map(e =>
          e.id === editingId
            ? { ...e, title, content, tags, updated: now }
            : e
        );
      }

      const existingDraftIndex = prev.findIndex(e => e.id === currentDraftId);

      if (currentDraftId && existingDraftIndex > -1) {
        const updated = [...prev];
        updated[existingDraftIndex] = {
          ...updated[existingDraftIndex],
          title,
          content,
          tags,
          updated: now
        };
        return updated;
      } else {
        const newId = Date.now();
        if (!currentDraftId) setCurrentDraftId(newId);

        const archivedPrev = prev.map(e => ({ ...e, archived: true }));

        const newEntry = {
          id: newId,
          title,
          content,
          tags,
          archived: false,
          created: now
        };
        return [newEntry, ...archivedPrev];
      }
    });

    if (isAutoSave) {
      setSaveStatus('saving');
      setTimeout(() => {
        setSaveStatus('saved');
        setSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setTimeout(() => setSaveStatus(''), 3000);
      }, 300);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setEditingId(null);
      setCurrentDraftId(null);
      setSaveStatus('');
    }
  }, [title, content, tags, editingId, currentDraftId]);

  useEffect(() => {
    if (!title.trim() && !content.trim()) return;
    const timer = setTimeout(() => handleSave(true), 1000);
    return () => clearTimeout(timer);
  }, [title, content, tags, handleSave]);

  const handlePinSubmit = () => {
    if (pinInput.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }
    if (!storedPin) {
      localStorage.setItem('dusk-pin', pinInput);
      setIsLocked(false);
      setPinInput('');
    } else if (pinInput === storedPin) {
      setIsLocked(false);
      setPinInput('');
    } else {
      alert('Wrong PIN. Try again.');
      setPinInput('');
    }
  };

  const addTag = (tag) => {
    const cleanTag = tag.replace('#', '').trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      if (!customTags.includes(cleanTag)) {
        setCustomTags([...customTags, cleanTag]);
      }
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags || []);
    setEditingId(entry.id);
    setCurrentDraftId(null);
    setView('journal');
    setSelectedEntry(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry permanently?')) {
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) setSelectedEntry(null);
      if (editingId === id || currentDraftId === id) {
        setTitle('');
        setContent('');
        setTags([]);
        setEditingId(null);
        setCurrentDraftId(null);
      }
    }
  };

  const toggleArchive = (id) => {
    setEntries(entries.map(e =>
      e.id === id ? { ...e, archived: !e.archived } : e
    ));
    if (selectedEntry?.id === id) setSelectedEntry(null);
  };

  const toggleFolder = (dateStr) => {
    setExpandedFolders(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const exportPDF = (entry) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(entry.title, 20, 30);
    doc.setFontSize(12);
    doc.text(new Date(entry.created).toLocaleDateString(), 20, 45);
    if (entry.tags?.length) {
      doc.text(`Tags: ${entry.tags.join(', ')}`, 20, 55);
    }
    const lines = doc.splitTextToSize(entry.content, 170);
    doc.text(lines, 20, entry.tags?.length ? 70 : 60);
    doc.save(`${entry.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const exportAllPDF = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }
    entries.forEach(entry => exportPDF(entry));
    setShowSettings(false);
  };

  const exportJSON = () => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dusk-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowSettings(false);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        if (window.confirm(`Import ${imported.length} entries? This will replace current entries.`)) {
          setEntries(imported);
          alert('Backup restored successfully!');
        }
      } catch (err) {
        alert('Invalid backup file. Make sure it was exported from Dusk.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowSettings(false);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Notifications not supported on this browser');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      alert('7pm reminder enabled!');
      new Notification('Dusk Journal', {
        body: 'Reminders are now active. You will be notified at 7pm daily.',
        icon: '/icon-192.png'
      });
    }
    setShowSettings(false);
  };

  const openEntryView = (entry) => {
    setSelectedEntry(entry);
    setView('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredEntries = useMemo(() => {
    let filtered = entries;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => {
        const titleMatch = e.title.toLowerCase().includes(query);
        const contentMatch = e.content.toLowerCase().includes(query);
        const dateStr = new Date(e.created).toLocaleDateString();
        const dateMatch = dateStr.toLowerCase().includes(query);
        const tagMatch = e.tags?.some(t => t.toLowerCase().includes(query));
        return titleMatch || contentMatch || dateMatch || tagMatch;
      });
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [entries, searchQuery, sortOrder]);

  const journalEntries = filteredEntries.filter(e => !e.archived);
  const archivedEntries = filteredEntries.filter(e => e.archived);

  const archivedFolders = useMemo(() => {
    const groups = {};
    archivedEntries.forEach(entry => {
      const dateObj = new Date(entry.created);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(entry);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sortedDates.map(date => ({
      date,
      entries: groups[date]
    }));
  }, [archivedEntries, sortOrder]);

  const renderSettingsModal = () => (
    showSettings && (
      <div style={styles.modalOverlay} onClick={() => setShowSettings(false)}>
        <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Settings</h2>
            <button onClick={() => setShowSettings(false)} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#f5f5f0' : '#000' }}>×</button>
          </div>
          <button style={styles.modalButton} onClick={() => { setIsDark(!isDark); setShowSettings(false); }}>
            {isDark ? '☀️ Light Mode' : '🌙 Night Mode'}
          </button>
          <button style={styles.modalButton} onClick={requestNotificationPermission}>
            {Notification.permission === 'granted' ? '⏰ Reminder On' : '⏰ Enable 7pm Reminder'}
          </button>
          <button style={styles.modalButton} onClick={exportAllPDF}>
            📄 Export All as PDF
          </button>
          <button style={styles.modalButton} onClick={exportJSON}>
            💾 Export JSON
          </button>
          <label style={{ ...styles.modalButton, display: 'block', cursor: 'pointer' }}>
            📤 Import Backup
            <input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
          </label>
          <button style={{ ...styles.modalButton, color: '#ef4444' }} onClick={handleLock}>
            🔒 Lock App
          </button>
        </div>
      </div>
    )
  );

  const renderFooter = () => (
    <div style={{ borderTop: `1px solid ${isDark ? '#404040' : '#fbcfe8'}`, marginTop: 40, paddingTop: 16, paddingBottom: 24, textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: isDark ? '#f5f5f0' : '#be185d', fontWeight: 500, margin: 0 }}>
        Dusk Journal • THE KING'S HOUSEHOLD MEDIA UNIT
      </p>
      <p style={{ fontSize: 12, color: isDark ? '#a0a0a0' : '#9d174d', marginTop: 4 }}>
        v4.0 • Prophetic Services holds on Tuesdays 5pm.
      </p>
    </div>
  );

  if (isLocked) {
    return (
      <div style={styles.lockScreen}>
        <div style={styles.lockBox}>
          <h2 style={styles.title}>{storedPin ? 'Dusk Locked' : 'Set Your PIN'}</h2>
          <p style={styles.subtitle}>
            {storedPin ? 'Enter 4-digit PIN to unlock' : 'Create a 4-digit PIN to secure your journal'}
          </p>
          <input
            style={{ ...styles.input, textAlign: 'center', fontSize: 28, letterSpacing: 12, fontWeight: 600 }}
            type="password"
            maxLength={4}
            placeholder="••••"
            value={pinInput}
            onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
            autoFocus
          />
          <button style={{ ...styles.button, width: '100%' }} onClick={handlePinSubmit}>
            {storedPin ? 'Unlock' : 'Set PIN'}
          </button>
          <p style={{ fontSize: 12, color: isDark ? '#a0a0a0' : '#9d174d', marginTop: 16 }}>
            PIN is stored locally on your device only
          </p>
        </div>
      </div>
    );
  }

  if (view === 'entry' && selectedEntry) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <button style={styles.settingsBtn} onClick={() => setShowSettings(true)}>
            ⚙️ Settings
          </button>
          <div style={styles.entry}>
            <h3 style={styles.entryTitle}>{selectedEntry.title}</h3>
            {selectedEntry.tags?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {selectedEntry.tags.map(t => (
                  <span key={t} style={styles.tag}>#{t}</span>
                ))}
              </div>
            )}
            <p style={styles.entryContent}>{selectedEntry.content}</p>
            <p style={styles.entryDate}>
              {new Date(selectedEntry.created).toLocaleDateString()}
            </p>
            <div style={styles.entryActions}>
              <button style={styles.button} onClick={() => handleEdit(selectedEntry)}>Edit</button>
              <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => handleDelete(selectedEntry.id)}>Delete</button>
              <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => { setView('archive'); setSelectedEntry(null); }}>Return to Archive</button>
            </div>
          </div>
          {renderFooter()}
        </div>
        {renderSettingsModal()}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button style={styles.settingsBtn} onClick={() => setShowSettings(true)}>
          ⚙️ Settings
        </button>

        {swUpdateAvailable && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button
              style={{ ...styles.button, backgroundColor: '#16a34a', marginTop: 0 }}
              onClick={() => {
                if (swRegistration?.waiting) {
                  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }}
            >
              🔄 Update Available
            </button>
          </div>
        )}

        {!isOnline && (
          <div style={styles.offlineBanner}>
            No network. Please turn on your data
          </div>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>Dusk</h1>
          <p style={styles.subtitle}>King's Household</p>
        </div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(view === 'journal' ? styles.tabActive : {}) }}
            onClick={() => {
              setView('journal');
              setSelectedEntry(null);
              if (!editingId) setCurrentDraftId(null);
            }}
          >
            Journal
          </button>
          <button
            style={{ ...styles.tab, ...(view === 'archive' ? styles.tabActive : {}) }}
            onClick={() => { setView('archive'); setSelectedEntry(null); }}
          >
            Archive ({archivedEntries.length})
          </button>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              style={{ ...styles.input, marginBottom: 0, paddingRight: 40 }}
              placeholder="Search by date, title, tags, or any word..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  color: isDark ? '#f5f5f0' : '#9d174d',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            style={{ ...styles.buttonSecondary, marginTop: 0 }}
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          >
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        {searchQuery && (
          <p style={{ fontSize: 12, color: isDark ? '#a0a0a0' : '#6b7280', marginTop: -12, marginBottom: 12 }}>
            Found {journalEntries.length + archivedEntries.length} entries
          </p>
        )}

        {view === 'journal' && (
          <>
            <div style={styles.form}>
              <input
                style={styles.input}
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div style={{ marginBottom: 12 }}>
                <input
                  style={styles.input}
                  placeholder="Add tags... type and press Enter"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
                  list="tag-list"
                />
                <datalist id="tag-list">
                  {customTags.map(t => <option key={t} value={t} />)}
                </datalist>
                {tags.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {tags.map(t => (
                      <span key={t} style={styles.tag}>
                        #{t} <span style={styles.tagRemove} onClick={() => removeTag(t)}>×</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                style={styles.textarea}
                placeholder="Write your thoughts..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <button style={styles.button} onClick={() => handleSave(false)}>
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
                {saveStatus === 'saving' && (
                  <span style={{ fontSize: 12, color: isDark ? '#d4d4d0' : '#9d174d' }}>Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span style={styles.saveIndicator}>
                    Draft saved • {saveTime}
                  </span>
                )}
                {editingId && (
                  <button
                    style={{ ...styles.button, ...styles.buttonSecondary }}
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setContent('');
                      setTags([]);
                      setSaveStatus('');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {journalEntries.length === 0 ? (
              <p style={{ textAlign: 'center', color: isDark ? '#a0a0a0' : '#6b7280' }}>
                {searchQuery ? 'No entries match your search' : 'No entries yet. Write your first one!'}
              </p>
            ) : (
              journalEntries.map(entry => (
                <div key={entry.id} style={styles.entry}>
                  <h3 style={styles.entryTitle}>{entry.title}</h3>
                  {entry.tags?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {entry.tags.map(t => (
                        <span key={t} style={styles.tag}>#{t}</span>
                      ))}
                    </div>
                  )}
                  <p style={styles.entryContent}>{entry.content}</p>
                  <p style={styles.entryDate}>
                    {new Date(entry.created).toLocaleDateString()}
                  </p>
                  <div style={styles.entryActions}>
                    <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => handleEdit(entry)}>Edit</button>
                    <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => toggleArchive(entry.id)}>Archive</button>
                    <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => handleDelete(entry.id)}>Delete</button>
                    <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => exportPDF(entry)}>Export PDF</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {view === 'archive' && (
          <>
            {archivedFolders.length === 0 ? (
              <p style={{ textAlign: 'center', color: isDark ? '#a0a0a0' : '#6b7280' }}>
                {searchQuery ? 'No archived entries match your search' : 'No archived entries yet'}
              </p>
            ) : (
              archivedFolders.map(folder => {
                const isOpen = !!expandedFolders[folder.date];
                return (
                  <div key={folder.date} style={styles.folder}>
                    <div style={styles.folderHeader} onClick={() => toggleFolder(folder.date)}>
                      <span>📅 {folder.date}</span>
                      <span>{isOpen ? '📂' : '📁'} ({folder.entries.length})</span>
                    </div>
                    {isOpen && (
                      <div style={styles.folderContent}>
                        {folder.entries.map(entry => (
                          <div 
                            key={entry.id} 
                            style={styles.clickableTitle}
                            onClick={() => openEntryView(entry)}
                          >
                            • {entry.title || "Untitled Entry"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
        {renderFooter()}
      </div>
      {renderSettingsModal()}
    </div>
  );
}
