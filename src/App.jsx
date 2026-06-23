import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fdf2f8',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '40px 20px',
    color: '#000'
  },
  wrapper: {
    maxWidth: 700,
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    color: '#be185d'
  },
  subtitle: {
    fontSize: 14,
    color: '#9d174d',
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
    border: '1px solid #fbcfe8',
    backgroundColor: '#fff',
    color: '#000',
    cursor: 'pointer',
    fontSize: 14
  },
  tabActive: {
    backgroundColor: '#ec4899',
    color: '#fff',
    border: '1px solid #ec4899'
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #fbcfe8',
    marginBottom: 30
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #f9a8d4',
    borderRadius: 8,
    marginBottom: 12,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#000'
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #f9a8d4',
    borderRadius: 8,
    minHeight: 120,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    color: '#000'
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
    backgroundColor: '#fff',
    color: '#be185d',
    border: '1px solid #fbcfe8'
  },
  entry: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #fbcfe8',
    marginBottom: 16
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#be185d',
    cursor: 'pointer'
  },
  entryContent: {
    fontSize: 14,
    color: '#000',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap'
  },
  entryDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8
  },
  entryActions: {
    marginTop: 12,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  offlineBanner: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '10px 16px',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid #fcd34a'
  },
  tag: {
    display: 'inline-block',
    backgroundColor: '#fbcfe8',
    color: '#9d174d',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginTop: 6
  },
  lockScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf2f8'
  },
  lockBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    border: '1px solid #fbcfe8',
    textAlign: 'center',
    maxWidth: 400,
    width: '100%'
  }
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('journal');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [customTags, setCustomTags] = useState(['Visions', 'Bible Study', 'Work', 'Family']);

  // PIN Lock - enforced on every load
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const storedPin = localStorage.getItem('dusk-pin');

  useEffect(() => {
    // Load data only after unlock
    if (!isLocked) {
      const saved = localStorage.getItem('dusk-entries');
      if (saved) setEntries(JSON.parse(saved));

      const savedTags = localStorage.getItem('dusk-tags');
      if (savedTags) setCustomTags(JSON.parse(savedTags));
    }
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) {
      localStorage.setItem('dusk-entries', JSON.stringify(entries));
    }
  }, [entries, isLocked]);

  useEffect(() => {
    if (!isLocked) {
      localStorage.setItem('dusk-tags', JSON.stringify(customTags));
    }
  }, [customTags, isLocked]);

  // 7pm Daily Reminder
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const scheduleReminder = () => {
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(19, 0, 0, 0); // 7pm WAT

      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Dusk Journal', {
            body: 'Time to reflect. Open Dusk and write your thoughts for today.',
            icon: '/favicon.ico'
          });
        }
        scheduleReminder();
      }, timeUntilReminder);
    };

    scheduleReminder();
  }, []);

  useEffect(() => {
    const autoSave = () => {
      if (!isLocked && (title.trim() || content.trim())) {
        handleSave(true);
      }
    };
    window.addEventListener('beforeunload', autoSave);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') autoSave();
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', autoSave);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [title, content, editingId, entries, tags, isLocked]);

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

  const handlePinSubmit = () => {
    if (pinInput.length!== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    if (!storedPin) {
      // First time - set PIN
      localStorage.setItem('dusk-pin', pinInput);
      setIsLocked(false);
      setPinInput('');
    } else {
      // Unlock
      if (pinInput === storedPin) {
        setIsLocked(false);
        setPinInput('');
      } else {
        alert('Wrong PIN. Try again.');
        setPinInput('');
      }
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setEntries([]);
    setTitle('');
    setContent('');
    setTags([]);
    setEditingId(null);
    setView('journal');
    setSelectedEntry(null);
  };

  const addTag = (tag) => {
    const cleanTag = tag.replace('#', '').trim();
    if (cleanTag &&!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      if (!customTags.includes(cleanTag)) {
        setCustomTags([...customTags, cleanTag]);
      }
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t!== tag));
  };

  const handleSave = (silent = false) => {
    if (!title.trim() ||!content.trim()) return;

    if (editingId) {
      setEntries(entries.map(e =>
        e.id === editingId
         ? {...e, title, content, tags, updated: new Date().toISOString() }
          : e
      ));
      setEditingId(null);
    } else {
      setEntries([{ id: Date.now(), title, content, tags, archived: false, created: new Date().toISOString() },...entries]);
    }
    if (!silent) {
      setTitle('');
      setContent('');
      setTags([]);
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags || []);
    setEditingId(entry.id);
    setView('journal');
    setSelectedEntry(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry permanently?')) {
      setEntries(entries.filter(e => e.id!== id));
      if (selectedEntry?.id === id) setSelectedEntry(null);
    }
  };

  const toggleArchive = (id) => {
    setEntries(entries.map(e =>
      e.id === id? {...e, archived:!e.archived } : e
    ));
    if (selectedEntry?.id === id) setSelectedEntry(null);
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
    doc.text(lines, 20, entry.tags?.length? 70 : 60);
    doc.save(`${entry.title.replace(/\s+/g, '_')}.pdf`);
  };

  const exportAllPDF = () => {
    entries.forEach(entry => exportPDF(entry));
  };

  const openEntryView = (entry) => {
    setSelectedEntry(entry);
    setView('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterEntries = (entryList) => {
    let filtered = entryList;

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

    filtered.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return sortOrder === 'newest'? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const journalEntries = filterEntries(entries.filter(e =>!e.archived));
  const archivedEntries = filterEntries(entries.filter(e => e.archived));

  // PIN Lock Screen - shows before anything else
  if (isLocked) {
    return (
      <div style={styles.lockScreen}>
        <div style={styles.lockBox}>
          <h2 style={styles.title}>{storedPin? 'Dusk Locked' : 'Set Your PIN'}</h2>
          <p style={styles.subtitle}>
            {storedPin? 'Enter 4-digit PIN to unlock' : 'Create a 4-digit PIN to secure your journal'}
          </p>
          <input
            style={{...styles.input, textAlign: 'center', fontSize: 28, letterSpacing: 12, fontWeight: 600 }}
            type="password"
            maxLength={4}
            placeholder="••••"
            value={pinInput}
            onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
            autoFocus
          />
          <button style={{...styles.button, width: '100%' }} onClick={handlePinSubmit}>
            {storedPin? 'Unlock' : 'Set PIN'}
          </button>
          <p style={{ fontSize: 12, color: '#9d174d', marginTop: 16 }}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button style={styles.buttonSecondary} onClick={handleLock}>Lock App</button>
          </div>

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
              <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => handleDelete(selectedEntry.id)}>Delete</button>
              <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => setView('archive')}>Return to Archive</button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #fbcfe8', marginTop: 40, paddingTop: 16, paddingBottom: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#be185d', fontWeight: 500, margin: 0 }}>
              Dusk Journal • THE KING'S HOUSEHOLD MEDIA UNIT
            </p>
            <p style={{ fontSize: 12, color: '#9d174d', marginTop: 4 }}>
              v2.1 • Updates posted here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button style={styles.buttonSecondary} onClick={handleLock}>Lock App</button>
        </div>

        {!isOnline && (
          <div style={styles.offlineBanner}>
            No network. Please turn on your data
          </div>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>Dusk</h1>
          <p style={styles.subtitle}>Your private journal</p>
        </div>

        <div style={styles.tabs}>
          <button
            style={{...styles.tab,...(view === 'journal'? styles.tabActive : {}) }}
            onClick={() => { setView('journal'); setSelectedEntry(null); }}
          >
            Journal
          </button>
          <button
            style={{...styles.tab,...(view === 'archive'? styles.tabActive : {}) }}
            onClick={() => { setView('archive'); setSelectedEntry(null); }}
          >
            Archive ({archivedEntries.length})
          </button>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              style={{...styles.input, marginBottom: 0, paddingRight: 40 }}
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
                  color: '#9d174d',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button
            style={{...styles.buttonSecondary, marginTop: 0 }}
            onClick={() => setSortOrder(sortOrder === 'newest'? 'oldest' : 'newest')}
          >
            {sortOrder === 'newest'? 'Newest' : 'Oldest'}
          </button>
        </div>

        {searchQuery && (
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: -12, marginBottom: 12 }}>
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
                  placeholder="Add tags... type and press Enter. e.g. Visions"
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
                        #{t} <span style={{ cursor: 'pointer' }} onClick={() => removeTag(t)}>×</span>
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
              <button style={styles.button} onClick={() => handleSave()}>
                {editingId? 'Update Entry' : 'Save Entry'}
              </button>
              {editingId && (
                <button
                  style={{...styles.button,...styles.buttonSecondary }}
                  onClick={() => { setEditingId(null); setTitle(''); setContent(''); setTags([]); }}
                >
                  Cancel
                </button>
              )}
            </div>

            {journalEntries.length === 0? (
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                {searchQuery? 'No entries match your search' : 'No entries yet. Write your first one!'}
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
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => handleEdit(entry)}>Edit</button>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => toggleArchive(entry.id)}>Archive</button>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => handleDelete(entry.id)}>Delete</button>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => exportPDF(entry)}>Export PDF</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {view === 'archive' && (
          <>
            {archivedEntries.length > 0 && (
              <button style={{...styles.button, marginBottom: 20 }} onClick={exportAllPDF}>
                Export All as PDF
              </button>
            )}

            {archivedEntries.length === 0? (
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                {searchQuery? 'No archived entries match your search' : 'No archived entries yet'}
              </p>
            ) : (
              archivedEntries.map(entry => (
                <div key={entry.id} style={styles.entry}>
                  <h3
                    style={styles.entryTitle}
                    onClick={() => openEntryView(entry)}
                  >
                    {entry.title}
                  </h3>
                  {entry.tags?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {entry.tags.map(t => (
                        <span key={t} style={styles.tag}>#{t}</span>
                      ))}
                    </div>
                  )}
                  <p style={styles.entryDate}>
                    Archived • {new Date(entry.created).toLocaleDateString()}
                  </p>
                  <div style={styles.entryActions}>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => toggleArchive(entry.id)}>Unarchive</button>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => handleDelete(entry.id)}>Delete</button>
                    <button style={{...styles.button,...styles.buttonSecondary }} onClick={() => exportPDF(entry)}>Export PDF</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        <div style={{ borderTop: '1px solid #fbcfe8', marginTop: 40, paddingTop: 16, paddingBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#be185d', fontWeight: 500, margin: 0 }}>
            Dusk Journal • THE KING'S HOUSEHOLD MEDIA UNIT
          </p>
          <p style={{ fontSize: 12, color: '#9d174d', marginTop: 4 }}>
            v2.1 • The King's Household Church | forteido@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
