import { useState, useEffect } from 'react'

function App() {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [view, setView] = useState('write')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('dusk-entries')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('dusk-entries', JSON.stringify(entries))
  }, [entries])

  const saveEntry = () => {
    if (!title.trim() ||!content.trim()) {
      alert('Please add title and content')
      return
    }

    if (editingId) {
      setEntries(entries.map(e =>
        e.id === editingId? {...e, title, content, updated: new Date().toISOString()} : e
      ))
      setEditingId(null)
    } else {
      const newEntry = {id: Date.now(), title, content, date: new Date().toISOString()}
      setEntries([newEntry,...entries])
    }

    setTitle('')
    setContent('')
    setView('archive')
  }

  const editEntry = (entry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setEditingId(entry.id)
    setView('write')
  }

  const deleteEntry = (id) => {
    if (confirm('Delete this entry?')) {
      setEntries(entries.filter(e => e.id!== id))
      if (editingId === id) {
        setTitle('')
        setContent('')
        setEditingId(null)
      }
    }
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const blob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dusk-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const exportPDF = () => {
    const printWindow = window.open('', '', 'height=800,width=600')
    const entriesHTML = entries.map(e => `
      <div style="margin-bottom:40px; page-break-inside:avoid">
        <h2 style="color:#d63384; margin:0 0 8px 0; font-size:22px">${e.title}</h2>
        <p style="color:#888; font-size:13px; margin:0 0 15px 0">${new Date(e.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
        <p style="white-space:pre-wrap; line-height:1.7; font-size:15px; color:#333">${e.content}</p>
      </div>
    `).join('')

    printWindow.document.write(`
      <html>
        <head><title>Dusk Journal</title>
        <style>body{font-family:-apple-system,Arial,sans-serif; padding:50px; max-width:700px; margin:0 auto}</style>
        </head>
        <body>
          <h1 style="color:#d63384; text-align:center; margin-bottom:10px">Dusk Journal</h1>
          <p style="text-align:center; color:#999; margin-bottom:50px">Exported ${new Date().toLocaleString()}</p>
          ${entriesHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const cancelEdit = () => {
    setTitle('')
    setContent('')
    setEditingId(null)
    setView('archive')
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#fff5f8',
      padding: '24px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    wrapper: {
      maxWidth: '680px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '15px',
      color: '#888',
      margin: 0
    },
    topBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '32px'
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: '14px 20px',
      background: active? '#1a1a1a' : 'white',
      color: active? 'white' : '#1a1a1a',
      border: '1.5px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    actionRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
      justifyContent: 'flex-end'
    },
    secondaryBtn: {
      padding: '10px 18px',
      background: 'white',
      color: '#1a1a1a',
      border: '1.5px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    primaryBtn: {
      padding: '14px 24px',
      background: '#d63384',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '16px'
    },
    input: {
      width: '100%',
      padding: '16px',
      marginBottom: '16px',
      fontSize: '16px',
      border: '1.5px solid #e0e0e0',
      borderRadius: '12px',
      boxSizing: 'border-box',
      outline: 'none',
      background: 'white',
      color: '#1a1a1a',
      transition: 'border 0.2s'
    },
    textarea: {
      width: '100%',
      minHeight: '280px',
      padding: '16px',
      fontSize: '16px',
      border: '1.5px solid #e0e0e0',
      borderRadius: '12px',
      boxSizing: 'border-box',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      background: 'white',
      color: '#1a1a1a',
      lineHeight: '1.6'
    },
    entryCard: {
      background: 'white',
      padding: '24px',
      marginBottom: '16px',
      borderRadius: '16px',
      cursor: 'pointer',
      border: '1.5px solid #f0f0f0',
      transition: 'border 0.2s, transform 0.2s'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: 0,
      flex: 1
    },
    cardDate: {
      fontSize: '13px',
      color: '#999',
      margin: '6px 0 16px 0'
    },
    cardContent: {
      fontSize: '15px',
      color: '#555',
      lineHeight: '1.6',
      margin: 0
    },
    iconBtn: {
      padding: '8px 12px',
      background: 'transparent',
      color: '#d63384',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dusk</h1>
          <p style={styles.subtitle}>Your private journal</p>
        </div>

        <div style={styles.topBar}>
          <button style={styles.tabBtn(view==='write')} onClick={() => {setView('write'); setEditingId(null); setTitle(''); setContent('')}}>
            {editingId? 'Edit Entry' : 'New Entry'}
          </button>
          <button style={styles.tabBtn(view==='archive')} onClick={() => setView('archive')}>
            Archive
          </button>
        </div>

        {view === 'write'? (
          <div>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
            />
            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={saveEntry} style={{...styles.primaryBtn, flex: 1}}>
                {editingId? 'Save Changes' : 'Save Entry'}
              </button>
              {editingId && (
                <button onClick={cancelEdit} style={{...styles.secondaryBtn, padding: '14px 24px'}}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {entries.length > 0 && (
              <div style={styles.actionRow}>
                <button onClick={exportJSON} style={styles.secondaryBtn}>Export JSON</button>
                <button onClick={exportPDF} style={styles.secondaryBtn}>Export PDF</button>
              </div>
            )}

            {entries.length === 0? (
              <div style={{textAlign: 'center', padding: '80px 20px'}}>
                <p style={{fontSize: '18px', color: '#ccc', marginBottom: '8px'}}>No entries yet</p>
                <p style={{fontSize: '15px', color: '#999'}}>Tap "New Entry" to start writing</p>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry.id} style={styles.entryCard} onClick={() => editEntry(entry)}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{entry.title}</h3>
                    <button onClick={(e) => {e.stopPropagation(); deleteEntry(entry.id)}} style={styles.iconBtn}>
                      Delete
                    </button>
                  </div>
                  <p style={styles.cardDate}>
                    {new Date(entry.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                  </p>
                  <p style={styles.cardContent}>
                    {entry.content.substring(0, 180)}{entry.content.length > 180? '...' : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
{/* Broadcast footer */}
<footer className="mt-16 border-t border-pink-100 pt-6 pb-8 px-4 text-center">
  <p className="text-xs text-gray-500">
    <span className="font-semibold text-pink-600">Dusk Journal Note:</span>
    {" "}Welcome to Dusk 🌙 Your entries stay private on your device.
  </p>
  <p className="text- text-gray-400 mt-2">
    Updates posted here • v1.0 • Made in Lagos
  </p>
</footer>
    </div>
  )
}

export default App
