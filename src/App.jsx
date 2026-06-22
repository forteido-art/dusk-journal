import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '40px 20px'
  },
  wrapper: {
    maxWidth: 600,
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
    color: '#111'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    marginBottom: 30
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    marginBottom: 12,
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    minHeight: 120,
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  button: {
    marginTop: 12,
    padding: '10px 20px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  entry: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    marginBottom: 16
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#111'
  },
  entryContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap'
  },
  entryDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8
  }
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dusk-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('dusk-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!title.trim() ||!content.trim()) return;

    if (editingId) {
      setEntries(entries.map(e =>
        e.id === editingId
         ? {...e, title, content, updated: new Date().toISOString()}
          : e
      ));
      setEditingId(null);
    } else {
      setEntries([{id: Date.now(), title, content, created: new Date().toISOString()},...entries]);
    }
    setTitle('');
    setContent('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dusk</h1>
          <p style={styles.subtitle}>Your private journal</p>
        </div>

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
          <button style={styles.button} onClick={handleSave}>
            {editingId? 'Update' : 'Save Entry'}
          </button>
        </div>

        {entries.map(entry => (
          <div key={entry.id} style={styles.entry}>
            <h3 style={styles.entryTitle}>{entry.title}</h3>
            <p style={styles.entryContent}>{entry.content}</p>
            <p style={styles.entryDate}>
              {new Date(entry.created).toLocaleDateString()}
            </p>
          </div>
        ))}

        {/* Broadcast Footer */}
        <div style={{borderTop: '1px solid #e5e7eb', marginTop: 40, paddingTop: 16, paddingBottom: 24, textAlign: 'center'}}>
          <p style={{fontSize: 14, color: '#374151', fontWeight: 500, margin: 0}}>
            Dusk Journal • THE KING'S HOUSEHOLD MEDIA UNIT
          </p>
          <p style={{fontSize: 12, color: '#6b7280', marginTop: 4}}>
            v1.0 • Updates posted here
          </p>
        </div>
      </div>
    </div>
  )
}
