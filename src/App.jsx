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
      alert('Add both title and content')
      return
    }

    if (editingId) {
      setEntries(entries.map(e =>
        e.id === editingId? {...e, title, content, date: new Date().toISOString()} : e
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
      <div style="margin-bottom:30px; page-break-inside:avoid">
        <h2 style="color:#d63384; margin-bottom:5px">${e.title}</h2>
        <p style="color:#666; font-size:12px; margin-bottom:10px">${new Date(e.date).toLocaleString()}</p>
        <p style="white-space:pre-wrap; line-height:1.6">${e.content}</p>
        <hr style="border:none; border-top:1px solid #eee; margin-top:20px">
      </div>
    `).join('')

    printWindow.document.write(`
      <html>
        <head><title>Dusk Journal Backup</title></head>
        <body style="font-family:Arial; padding:30px; color:black">
          <h1 style="color:#d63384; text-align:center">Dusk Journal Export</h1>
          <p style="text-align:center; color:#666">Exported on ${new Date().toLocaleString()}</p>
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
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      maxWidth: '600px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 20px 60px rgba(255,105,180,0.2)'
    },
    title: {
      textAlign: 'center',
      color: '#d63384',
      marginBottom: '25px',
      fontSize: '28px'
    },
    btnGroup: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    btn: (active) => ({
      flex: 1,
      padding: '12px',
      background: active? 'linear-gradient(135deg, #ff6b9d 0%, #d63384 100%)' : '#fff0f5',
      color: active? 'white' : '#d63384',
      border: '2px solid #ffb6c1',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    }),
    input: {
      width: '100%',
      padding: '14px',
      marginBottom: '12px',
      fontSize: '16px',
      border: '2px solid #ffb6c1',
      borderRadius: '12px',
      boxSizing: 'border-box',
      outline: 'none',
      background: 'white',
      color: 'black'
    },
    textarea: {
      width: '100%',
      height: '200px',
      padding: '14px',
      fontSize: '16px',
      border: '2px solid #ffb6c1',
      borderRadius: '12px',
      boxSizing: 'border-box',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      background: 'white',
      color: 'black'
    },
    saveBtn: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #ff6b9d 0%, #d63384 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      marginTop: '12px',
      cursor: 'pointer'
    },
    cancelBtn: {
      padding: '14px',
      background: '#ccc',
      color: 'black',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      marginTop: '12px',
      cursor: 'pointer'
    },
    entryCard: {
      background: 'white',
      padding: '18px',
      marginBottom: '12px',
      borderRadius: '15px',
      cursor: 'pointer',
      border: '2px solid #ffb6c1',
      color: 'black'
    },
    deleteBtn: {
      padding: '6px 12px',
      background: '#ff4757',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    exportBtn: {
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #ff6b9d 0%, #d63384 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '600',
      cursor: 'pointer',
      marginLeft: '8px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dusk Journal</h1>

        <div style={styles.btnGroup}>
          <button style={styles.btn(view==='write')} onClick={() => {setView('write'); setEditingId(null); setTitle(''); setContent('')}}>
            {editingId? '✏️ Edit' : '✨ New Entry'}
          </button>
          <button style={styles.btn(view==='archive')} onClick={() => setView('archive')}>
            📚 Archive ({entries.length})
          </button>
        </div>

        {view === 'write'? (
          <div>
            <input
              placeholder="Entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
            />
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={saveEntry} style={{...styles.saveBtn, flex: 1}}>
                {editingId? '💾 Update Entry' : '💾 Save Entry'}
              </button>
              {editingId && (
                <button onClick={cancelEdit} style={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: '#d63384'}}>Archive</h2>
              {entries.length > 0 && (
                <div>
                  <button onClick={exportJSON} style={styles.exportBtn}>📥 JSON</button>
                  <button onClick={exportPDF} style={styles.exportBtn}>📄 PDF</button>
                </div>
              )}
            </div>

            {entries.length === 0? (
              <p style={{textAlign: 'center', color: '#d63384', marginTop: '60px', fontSize: '18px'}}>No entries yet. Write your first one! ✨</p>
            ) : (
              entries.map(entry => (
                <div key={entry.id} style={styles.entryCard} onClick={() => editEntry(entry)}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div style={{flex: 1}}>
                      <h3 style={{margin: '0 0 8px 0', color: 'black'}}>{entry.title}</h3>
                      <p style={{color: '#666', fontSize: '13px', margin: '0 0 10px 0'}}>
                        {new Date(entry.date).toLocaleString()}
                      </p>
                      <p style={{margin: 0, color: 'black', whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>{entry.content.substring(0, 120)}{entry.content.length > 120? '...' : ''}</p>
                    </div>
                    <button onClick={(e) => {e.stopPropagation(); deleteEntry(entry.id)}} style={styles.deleteBtn}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
