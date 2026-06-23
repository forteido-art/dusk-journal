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
  }
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState('journal');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dusk-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('dusk-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const autoSave = () => {
      if (title.trim() || content.trim()) {
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
  }, [title, content, editingId, entries]);

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

  const handleSave = (silent = false) => {
    if (!title.trim() ||!content.trim()) return;

    if (editingId) {
      setEntries(entries.map(e =>
        e.id === editingId
        ? {...e, title, content, updated: new Date().toISOString() }
          : e
      ));
      setEditingId(null);
    } else {
      setEntries([{ id: Date.now(), title, content, archived: false, created: new Date().toISOString() },...entries]);
    }
    if (!silent) {
      setTitle('');
      setContent('');
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
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
    const lines = doc.splitTextToSize(entry.content, 170);
    doc.text(lines, 20, 60);
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
    if (!searchQuery.trim()) return entryList;

    const query = searchQuery.toLowerCase();

    return entryList.filter(e => {
      const titleMatch = e.title.toLowerCase().includes(query);
      const contentMatch = e.content.toLowerCase().includes(query);
      const dateStr = new Date(e.created).toLocaleDateString();
      const dateMatch = dateStr.toLowerCase().includes(query);

      return titleMatch || contentMatch || dateMatch;
    });
  };

  const journalEntries = filterEntries(entries.filter(e =>!e.archived));
  const archivedEntries = filterEntries(entries.filter(e => e.archived));

  if (view === 'entry' && selectedEntry) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.entry}>
            <h3 style={styles.entryTitle}>{selectedEntry.title}</h3>
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
              v1.0 • Sandfilled Rd, Aleto Eleme. forteido@gmail.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
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

        {/* Search Bar with Clear Button */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <input
            style={{...styles.input, marginBottom: 0, paddingRight: 40}}
            placeholder="Search by date, title, or any word..."
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
          {searchQuery && (
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              Found {journalEntries.length + archivedEntries.length} entries
            </p>
          )}
        </div>

        {view === 'journal' && (
          <>
            <div style={styles.form}>
              <input
                style={styles.input}
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
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
                  onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
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
            v1.0 • Updates posted here
          </p>
        </div>
      </div>
    </div>
  );
}
