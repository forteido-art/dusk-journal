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

  useEffect(() => {
    const saved = localStorage.getItem('dusk-entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

 
